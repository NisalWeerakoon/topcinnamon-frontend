import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import './App.css';
import Products from './components/Products';
import ProductDetail from './components/ProductDetail';
import { FaUser } from 'react-icons/fa';

// Navbar Component
function Navbar() {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const handleSearch = async (query) => {
    setSearchQuery(query);
    
    if (query.trim().length < 2) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    try {
      const response = await fetch(`http://localhost:8081/products`);
      const allProducts = await response.json();
      
      const filtered = allProducts.filter(product =>
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase()) ||
        product.category?.toLowerCase().includes(query.toLowerCase()) // Also search in category
      );
      
      console.log(`Found ${filtered.length} products matching "${query}"`); // Debug log
      
      setSearchResults(filtered);
      setShowSearchResults(true);
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  const handleProductSelect = () => {
    setShowSearchResults(false);
    setSearchQuery('');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.search-container')) {
        setShowSearchResults(false);
      }
      if (!event.target.closest('.user-account')) {
        setShowUserDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="navbar">
      <div className="nav-content">
        <div className="nav-links">
          <Link to="/">Home</Link>
          <a href="#">About</a>
          <Link 
            to="/" 
            className={location.pathname === '/' ? 'active' : ''}
          >
            Products
          </Link>
          <a href="#">Contact</a>
        </div>

        <div className="search-container">
          <input
            type="text"
            className="search-input"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            onFocus={() => searchResults.length > 0 && setShowSearchResults(true)}
          />
          
          {showSearchResults && searchResults.length > 0 && (
            <div className="search-results-dropdown">
              {searchResults.map(product => (
                <Link
                  key={product.id}
                  to={`/products/${product.id}`}
                  className="search-result-card"
                  onClick={handleProductSelect}
                >
                  <img 
                    src={`/images/${product.imageFilename}`} 
                    alt={product.name}
                    onError={(e) => e.target.src = '/images/default.jpg'}
                  />
                  <div className="search-result-info">
                    <h4>{product.name}</h4>
                    <span className="search-result-price">${product.price.toFixed(2)}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

          <div 
            className="user-account"
            onClick={() => setShowUserDropdown(!showUserDropdown)}
          >
            <button className="account-btn">
              <FaUser className="profile-icon" />
              <span>Account</span>
            </button>
            
            {showUserDropdown && (
              <div className="account-dropdown">
                <a href="#" onClick={() => alert('Sign In feature coming soon!')}>
                  Sign In
                </a>
                <a href="#" onClick={() => alert('Sign Up feature coming soon!')}>
                  Sign Up
                </a>
              </div>
            )}
          </div>
      </div>
    </nav>
  );
}

// Keep the rest of your App component the same...
function App() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (isScrolling) return;

      const sections = document.querySelectorAll('.product-section');
      const scrollPosition = window.scrollY + 200;

      sections.forEach((section, index) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        const sectionId = section.getAttribute('data-category');
        const isLastSection = index === sections.length - 1;

        if (isLastSection) {
          if (scrollPosition >= sectionTop) {
            setActiveCategory(sectionId);
          }
        } else {
          if (scrollPosition >= sectionTop && 
              scrollPosition < sectionTop + sectionHeight) {
            setActiveCategory(sectionId);
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isScrolling]);

  const scrollToCategory = (category) => {
    setIsScrolling(true);
    setActiveCategory(category);
  
    if (category === 'all') {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
      
      setTimeout(() => setIsScrolling(false), 800);
    }
    else {
      const section = document.querySelector(`[data-category="${category}"]`);
      if (section) {
        const offsetTop = section.offsetTop - 150;
        
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
        
        setTimeout(() => setIsScrolling(false), 800);
      }
    }
  };

  const HomePage = () => (
    <>
      <div className="hero-section">
        <div className="hero-content">
          <h1>Our Products</h1>
          <p>Premium Quality Ceylon Cinnamon</p>
        </div>
      </div>
      <main>
        <div className="menu-header">
          <h2>Our Products</h2>
        </div>
        <div className="menu-container">
          <div className="category-sidebar">
            <button 
              className={`category-btn ${activeCategory === 'all' ? 'active' : ''}`}
              onClick={() => scrollToCategory('all')}
            >
              All Products
              <span className="category-line"></span>
            </button>
            
            <button 
              className={`category-btn ${activeCategory === 'powder' ? 'active' : ''}`}
              onClick={() => scrollToCategory('powder')}
            >
              Cinnamon Powder
              <span className="category-line"></span>
            </button>
            
            <button 
              className={`category-btn ${activeCategory === 'sticks' ? 'active' : ''}`}
              onClick={() => scrollToCategory('sticks')}
            >
              Cinnamon Sticks
              <span className="category-line"></span>
            </button>
            
            <button 
              className={`category-btn ${activeCategory === 'oil' ? 'active' : ''}`}
              onClick={() => scrollToCategory('oil')}
            >
              Cinnamon Oil
              <span className="category-line"></span>
            </button>
          </div>
          
          <div className="products-container">
            <section className="product-section" data-category="powder">
              <Products category="powder" />
            </section>
            
            <section className="product-section" data-category="sticks">
              <Products category="sticks" />
            </section>
            
            <section className="product-section" data-category="oil">
              <Products category="oil" />
            </section>
          </div>
        </div>
      </main>
    </>
  );

  return (
    <Router>
      <div className="app">
        <Navbar />

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products/:id" element={<ProductDetail />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;