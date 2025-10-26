// Utility functions for Admin Dashboard

// Status class mapping
export const getStatusClass = (status) => {
    if (!status) return 'status-pending';
    
    const statusMap = {
        'Pending': 'status-pending',
        'SUBMITTED': 'status-pending',
        'Under Review': 'status-under-review',
        'UNDER_REVIEW': 'status-under-review',
        'Approved': 'status-approved',
        'APPROVED': 'status-approved',
        'Rejected': 'status-rejected',
        'REJECTED': 'status-rejected',
        'Responded': 'status-responded',
        'Read': 'status-read'
    };
    
    return statusMap[status] || 'status-pending';
};

// Display status formatting
export const getDisplayStatus = (status) => {
    if (!status) return 'Pending';
    
    const displayMap = {
        'SUBMITTED': 'Pending',
        'UNDER_REVIEW': 'Under Review',
        'APPROVED': 'Approved',
        'REJECTED': 'Rejected'
    };
    
    return displayMap[status] || status;
};

// Date formatting
export const formatDate = (date) => {
    if (!date) return 'N/A';
    
    try {
        const dateObj = new Date(date);
        if (isNaN(dateObj.getTime())) return 'Invalid Date';
        
        return dateObj.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch (error) {
        console.error('Date formatting error:', error);
        return 'Invalid Date';
    }
};

// HTML escaping
export const escapeHtml = (text) => {
    if (text === null || text === undefined) return '';
    
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    
    return String(text).replace(/[&<>"']/g, (m) => map[m]);
};

// Notification system
export const showNotification = (message, type = 'info', duration = 5000) => {
    // Remove any existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    const iconMap = {
        'success': 'fas fa-check-circle',
        'error': 'fas fa-exclamation-circle',
        'warning': 'fas fa-exclamation-triangle',
        'info': 'fas fa-info-circle'
    };
    
    notification.innerHTML = `
        <i class="${iconMap[type] || iconMap.info}"></i>
        <span>${escapeHtml(message)}</span>
        <button onclick="this.parentElement.remove()">&times;</button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after duration
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, duration);
};

// Error display for table elements
export const showError = (elementId, message) => {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = `
            <tr>
                <td colspan="100%">
                    <div class="error-state">
                        <i class="fas fa-exclamation-triangle"></i>
                        <p>${escapeHtml(message)}</p>
                    </div>
                </td>
            </tr>
        `;
    }
};

// CSV field escaping
export const escapeCsvField = (field) => {
    if (field === null || field === undefined) return '';
    const stringField = String(field);
    if (stringField.includes('"') || stringField.includes(',') || stringField.includes('\n')) {
        return '"' + stringField.replace(/"/g, '""') + '"';
    }
    return stringField;
};

// Debounce function for search/filtering
export const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// Local storage helpers
export const storage = {
    get: (key, defaultValue = null) => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.error('Error reading from localStorage:', error);
            return defaultValue;
        }
    },
    
    set: (key, value) => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error('Error writing to localStorage:', error);
        }
    },
    
    remove: (key) => {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error('Error removing from localStorage:', error);
        }
    }
};

// API helper functions
export const apiHelpers = {
    // Generic fetch wrapper with error handling
    fetch: async (url, options = {}) => {
        try {
            const response = await fetch(url, {
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                ...options
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return response;
        } catch (error) {
            console.error('API fetch error:', error);
            throw error;
        }
    },
    
    // GET request helper
    get: async (url) => {
        return apiHelpers.fetch(url);
    },
    
    // POST request helper
    post: async (url, data) => {
        return apiHelpers.fetch(url, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },
    
    // PUT request helper
    put: async (url, data) => {
        return apiHelpers.fetch(url, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    },
    
    // DELETE request helper
    delete: async (url) => {
        return apiHelpers.fetch(url, {
            method: 'DELETE'
        });
    }
};

// Validation helpers
export const validators = {
    email: (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },
    
    phone: (phone) => {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
    },
    
    required: (value) => {
        return value !== null && value !== undefined && String(value).trim() !== '';
    }
};

// Format helpers
export const formatters = {
    currency: (amount, currency = 'USD') => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency
        }).format(amount);
    },
    
    number: (number) => {
        return new Intl.NumberFormat('en-US').format(number);
    },
    
    percentage: (value, decimals = 1) => {
        return `${(value * 100).toFixed(decimals)}%`;
    }
};
