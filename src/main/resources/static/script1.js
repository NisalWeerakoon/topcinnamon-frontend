const API_BASE = "http://localhost:8085/api";
let currentUserId = null;

// ---------------- SIGNUP ----------------
function signup() {
    const username = document.getElementById("signup-username").value;
    const email = document.getElementById("signup-email").value;
    const password = document.getElementById("signup-password").value;

    fetch(`${API_BASE}/auth/signup`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({username, email, password})
    })
    .then(res => res.json())
    .then(data => {
        alert("Signup successful! Your userId: " + data.id);
        // Store userId after signup
        localStorage.setItem("userId", data.id);
    })
    .catch(err => console.error(err));
}

// ---------------- LOGIN ----------------
function login(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('login-error');

    // Fixed: Use backticks for template literal
    fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Invalid credentials');
        }
        return response.json();
    })
    .then(data => {
        // Store both token and userId
        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', data.userId || data.id); // Store userId
        localStorage.setItem('username', data.username); // Optional
        window.location.href = '/cart.html';
    })
    .catch(error => {
        console.error('Login error:', error);
        if (errorMessage) {
            errorMessage.classList.add('show');
        }
    });
}

// ---------------- Helper function to get auth headers ----------------
function getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
    };
}

// ---------------- FETCH PRODUCTS ----------------
function fetchProducts() {
    fetch(`${API_BASE}/products`, {
        headers: getAuthHeaders() // Include auth if required
    })
    .then(res => res.json())
    .then(data => {
        const ul = document.getElementById("products");
        ul.innerHTML = "";
        data.forEach(p => {
            const li = document.createElement("li");
            li.textContent = `${p.name} - $${p.price}`;
            const btn = document.createElement("button");
            btn.textContent = "Add to Cart";
            btn.onclick = () => addToCart(p.id);
            li.appendChild(btn);
            ul.appendChild(li);
        });
    })
    .catch(err => console.error('Error fetching products:', err));
}

// ---------------- ADD TO CART ----------------
function addToCart(productId, productName) {
    const quantity = parseInt(document.getElementById(`quantity-${productId}`).value);
    const userId = 1;

    // Add debug logging
    console.log('Attempting to add to cart:', {
        url: `${BASE_URL}/add`,
        data: { userId, productId, quantity }
    });

    fetch(`${BASE_URL}/add`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            userId: userId,
            productId: productId,
            quantity: quantity
        })
    })
    .then(response => {
        console.log('Response status:', response.status);
        if (!response.ok) {
            return response.text().then(text => {
                throw new Error(`Server error: ${text}`);
            });
        }
        return response.json();
    })
    .then(data => {
        console.log('Success:', data);
        alert(`${productName} added to cart successfully`);
        getCartItems();
    })
    .catch(error => {
        console.error('Detailed error:', error);
        alert('Error adding item to cart. Check console for details.');
    });
}

// ---------------- FETCH CART (FIXED) ----------------
function fetchCart() {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    
    if (!userId || !token) {
        console.log("User not logged in");
        return;
    }
    
    fetch(`${API_BASE}/cart/${userId}`, {
        headers: getAuthHeaders() // Include auth headers
    })
    .then(res => res.json())
    .then(data => {
        const ul = document.getElementById("cart");
        if (ul) {
            ul.innerHTML = "";
            data.forEach(item => {
                const li = document.createElement("li");
                li.textContent = `${item.product.name} x ${item.quantity}`;
                ul.appendChild(li);
            });
        }
    })
    .catch(err => console.error('Error fetching cart:', err));
}

// ---------------- PLACE ORDER (FIXED) ----------------
function placeOrder() {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    
    if (!userId || !token) {
        alert("Please login first!");
        return;
    }
    
    fetch(`${API_BASE}/orders/place`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({userId: parseInt(userId)})
    })
    .then(res => res.json())
    .then(data => {
        alert("Order placed! Order ID: " + data.id);
        fetchCart(); // refresh cart
    })
    .catch(err => console.error('Error placing order:', err));
}

// ---------------- FETCH ORDERS (FIXED) ----------------
function fetchOrders() {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    
    if (!userId || !token) {
        return;
    }
    
    fetch(`${API_BASE}/orders/${userId}`, {
        headers: getAuthHeaders()
    })
    .then(res => res.json())
    .then(data => {
        const ul = document.getElementById("orders");
        if (ul) {
            ul.innerHTML = "";
            data.forEach(order => {
                const li = document.createElement("li");
                li.textContent = `Order #${order.id} - Total: $${order.totalAmount}`;
                ul.appendChild(li);
            });
        }
    })
    .catch(err => console.error('Error fetching orders:', err));
}

// ---------------- LOGOUT FUNCTION ----------------
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    window.location.href = '/login.html';
}

// ---------------- CHECK AUTH STATUS ----------------
function checkAuth() {
    const token = localStorage.getItem('token');
    if (!token && window.location.pathname !== '/login.html') {
        window.location.href = '/login.html';
    }
}

// Call on page load
checkAuth();
if (document.getElementById("products")) fetchProducts();
if (document.getElementById("cart")) fetchCart();
if (document.getElementById("orders")) fetchOrders();