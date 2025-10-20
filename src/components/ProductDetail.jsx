import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import './ProductDetail.css';

function ProductDetail() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(null);
    const [review, setReview] = useState('');
    const [reviews, setReviews] = useState([]);
    const [sortBy, setSortBy] = useState('newest');
    const [quantity, setQuantity] = useState(1);
    const [orderType, setOrderType] = useState('single');

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`http://localhost:8081/products/${id}`);
                const data = await response.json();
                setProduct(data);
            } catch (error) {
                console.error('Error fetching product:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    const calculatePrice = () => {
        if (!product) return 0;
        const basePrice = product.price * quantity;
        // 10% discount for bulk orders
        return orderType === 'bulk' ? (basePrice * 0.9).toFixed(2) : basePrice.toFixed(2);
    };

    const handleAddToCart = () => {
        alert('Please sign in to add items to cart');
    };

    const handleBuyNow = () => {
        alert('Please sign in to proceed with purchase');
    };

    const handleSubmitReview = (e) => {
        e.preventDefault();
        alert('Please sign in to submit a review');
    };

    const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                stars.push(<FaStar key={i} className="star filled" />);
            } else if (i - 0.5 <= rating) {
                stars.push(<FaStarHalfAlt key={i} className="star half" />);
            } else {
                stars.push(<FaRegStar key={i} className="star" />);
            }
        }
        return stars;
    };

    const getUnit = () => {
        // You might need to determine the category from the product data
        // For now, let's check the product name or add logic based on your data
        if (product?.name?.toLowerCase().includes('oil')) {
            return 'per 100ml';
        }
        return 'per 100g';
    };
    
    if (loading) return null;
    if (!product) return <div>Product not found</div>;

    return (
        <div className="product-detail-container">
            <div className="breadcrumb">
                <Link to="/">Home</Link>
                <span>/</span>
                <Link to="/">Products</Link>
                <span>/</span>
                <span>{product.name}</span>
            </div>

            <div className="product-detail">
                <div className="product-image-container">
                    <img 
                        src={`/images/${product.imageFilename}`} 
                        alt={product.name}
                        onError={(e) => {
                            e.target.src = '/images/default.jpg';
                        }}
                    />
                </div>

                <div className="product-info-container">
                    <h1>{product.name}</h1>
                    
                    <div className="price-section">
                        <span className="price-label">Price:</span>
                        <span className="price-amount">
                            ${calculatePrice()}
                            <small className="unit"> ({getUnit()})</small>
                        </span>
                        {orderType === 'bulk' && (
                            <span className="discount-badge">10% OFF</span>
                        )}
                    </div>

                    <div className="order-options">
                        <div className="order-type">
                            <button 
                                className={orderType === 'single' ? 'active' : ''}
                                onClick={() => setOrderType('single')}
                            >
                                Single Order
                            </button>
                            <button 
                                className={orderType === 'bulk' ? 'active' : ''}
                                onClick={() => {
                                    setOrderType('bulk');
                                    setQuantity(10);
                                }}
                            >
                                Bulk Order (10+)
                            </button>
                        </div>

                        <div className="quantity-control">
                            <button 
                                onClick={() => setQuantity(Math.max(orderType === 'bulk' ? 10 : 1, quantity - 1))}
                            >
                                -
                            </button>
                            <input 
                                type="number" 
                                value={quantity}
                                onChange={(e) => {
                                    const val = parseInt(e.target.value) || 1;
                                    setQuantity(orderType === 'bulk' ? Math.max(10, val) : Math.max(1, val));
                                }}
                            />
                            <button onClick={() => setQuantity(quantity + 1)}>
                                +
                            </button>
                        </div>
                    </div>

                    <p className="product-description">{product.description}</p>
                    
                    <div className="stock-info">
                        Stock: {product.stock_quantity} units available
                    </div>

                    <div className="action-buttons">
                        <button 
                            className="btn-primary"
                            onClick={handleAddToCart}
                            disabled={product.stock_quantity <= 0}
                        >
                            Add to Cart
                        </button>
                        <button 
                            className="btn-secondary"
                            onClick={handleBuyNow}
                            disabled={product.stock_quantity <= 0}
                        >
                            Buy Now
                        </button>
                    </div>
                </div>
            </div>

            <div className="reviews-section">
                <h2>Customer Reviews</h2>
                <div className="sort-options">
                    <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                        <option value="newest">Newest First</option>
                        <option value="highest">Highest Rated</option>
                    </select>
                </div>

                <form onSubmit={handleSubmitReview} className="review-form">
                    <div className="rating-input">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <FaStar
                                key={star}
                                className={star <= (hover || rating) ? 'star filled' : 'star'}
                                onClick={() => setRating(star)}
                                onMouseEnter={() => setHover(star)}
                                onMouseLeave={() => setHover(null)}
                            />
                        ))}
                    </div>
                    <textarea
                        value={review}
                        onChange={(e) => setReview(e.target.value)}
                        placeholder="Write your review..."
                        required
                    />
                    <button type="submit">Submit Review</button>
                </form>

                <div className="reviews-list">
                    {reviews.map(review => (
                        <div key={review.id} className="review-card">
                            <div className="review-header">
                                <div className="review-rating">
                                    {renderStars(review.rating)}
                                </div>
                                <div className="review-date">
                                    {new Date(review.date).toLocaleDateString()}
                                </div>
                            </div>
                            <p className="review-comment">{review.comment}</p>
                            <button className="helpful-btn">
                                Helpful ({review.helpful})
                            </button>
                        </div>
                    ))}
                </div>
                
            </div>
        </div>
    );
}

export default ProductDetail;