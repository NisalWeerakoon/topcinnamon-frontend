import React from 'react';
import ReactDOM from 'react-dom/client';
import ProductReview from './components/ProductReview';
import ContactUs from './components/ContactUs';

// App component without navigation - shows only one component at a time
const App = () => {
    // Determine which component to show based on URL or window variable
    const getCurrentView = () => {
        // Check if there's a window variable override (for direct HTML access)
        if (window.REACT_APP_DEFAULT_VIEW) {
            return window.REACT_APP_DEFAULT_VIEW;
        }
        
        // Check URL pathname for routing
        const path = window.location.pathname.toLowerCase();
        if (path.includes('/reviews') || path.includes('/review')) return 'reviews';
        if (path.includes('/contact')) return 'contact';
        
        // Default to admin dashboard
        return 'admin';
    };

    const currentView = getCurrentView();

    return (
        <div>

            {currentView === 'reviews' && <ProductReview />}
            {currentView === 'contact' && <ContactUs />}
        </div>
    );
};

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);

