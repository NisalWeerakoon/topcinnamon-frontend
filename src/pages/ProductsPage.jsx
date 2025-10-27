import { useState, useEffect } from 'react';
import Products from '../components/Products/Products';

function ProductsPage() {
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

  return (
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

            <button 
                className={`category-btn ${activeCategory === 'other' ? 'active' : ''}`}
                onClick={() => scrollToCategory('other')}
            >
                Other
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

            <section className="product-section" data-category="other">
                <Products category="other" />
            </section>
          </div>
        </div>
      </main>
    </>
  );
}

export default ProductsPage;