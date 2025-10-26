import React, { useState, useEffect, useCallback, useMemo } from 'react';
import './ProductReview.css';
import { generateStarRating, escapeHtml, formatDate, formatMessageDate } from '../utils/reviewUtils';

// API Base URL
const API_BASE_URL = '/api/reviews';

// Product type options (extracted from the select dropdown)
const PRODUCT_OPTIONS = [
    { value: "Others", label: "Others" },
    { value: "ALBA", label: "ALBA" },
    { value: "C5-Special", label: "C5-Special" },
    { value: "C5", label: "C5" },
    { value: "C4", label: "C4" },
    { value: "M4", label: "M4" },
    { value: "H1", label: "H1" },
    { value: "H2", label: "H2" },
    { value: "H2 FAQ", label: "H2 FAQ" },
    { value: "No 2 Quillings", label: "No 2 Quillings" },
    { value: "Cut Cinnamon", label: "Cut Cinnamon" },
    { value: "Cinnamon Powder", label: "Cinnamon Powder" },
    { value: "Cinnamon Leaf", label: "Cinnamon Leaf" },
    { value: "Cinnamon Drink", label: "Cinnamon Drink" },
];

// Helper functions (kept in the component for context but can be moved to utils)
const getCurrentProductId = () => new URLSearchParams(window.location.search).get('productId') || 'default-product-001';
const getCurrentProductName = () => 'Cinnamon Product';

// ===================================================================
// Main Component
// ===================================================================

const ProductReview = () => {
    // Review Submission Form State
    const [formData, setFormData] = useState({
        customerName: '',
        email: '',
        rating: 0,
        reviewTitle: '',
        comment: '',
        productType: '',
        verifiedPurchase: false,
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingReviewId, setEditingReviewId] = useState(null);

    // Review Display State
    const [reviews, setReviews] = useState(null);
    const [stats, setStats] = useState(null);
    const [sortBy, setSortBy] = useState('relevance');
    const [filterBy, setFilterBy] = useState('all');

    // Messages Panel State
    const [userReviews, setUserReviews] = useState(null);
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const customerEmail = formData.email.trim();

    // ==================== API Callbacks ====================

    const loadReviewStatistics = useCallback(async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/statistics`);
            if (response.ok) {
                const data = await response.json();
                setStats(data);
            }
        } catch (error) {
            console.error('❌ Error loading review statistics:', error);
        }
    }, []);

    const loadReviews = useCallback(async () => {
        setReviews(null); // Set loading state
        try {
            const response = await fetch(`${API_BASE_URL}/approved`);
            if (response.ok) {
                const approvedReviews = await response.json();
                setReviews(approvedReviews);
            }
        } catch (error) {
            console.error('❌ Error loading reviews:', error);
            setReviews([]); // Set empty array on failure
        }
    }, []);

    const loadUserReviews = useCallback(async () => {
        if (!customerEmail) {
            setUserReviews([]);
            return;
        }

        setUserReviews(null);
        try {
            // Fetch all reviews and filter by email
            const response = await fetch(`${API_BASE_URL}/admin/all`);
            if (!response.ok) throw new Error(`Server returned ${response.status}`);

            const allReviews = await response.json();
            const filteredReviews = allReviews.filter(review =>
                review.email && review.email.toLowerCase() === customerEmail.toLowerCase()
            );

            // Sort by newest first
            filteredReviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setUserReviews(filteredReviews);

            // Auto-show panel if we have messages and it's not already open
            if (filteredReviews.length > 0 && !isPanelOpen) {
                setIsPanelOpen(true);
            }

        } catch (error) {
            console.error('❌ Error loading user reviews:', error);
            setUserReviews([]);
        }
    }, [customerEmail, isPanelOpen]);

    // ==================== Effects ====================

    useEffect(() => {
        loadReviewStatistics();
        loadReviews();

        // Initial check for user reviews if email is already present
        if (customerEmail) {
            loadUserReviews();
        }

        // Auto-refresh interval
        const intervalId = setInterval(() => {
            loadReviewStatistics();
            loadReviews();
        }, 10000);

        return () => clearInterval(intervalId);
    }, [loadReviewStatistics, loadReviews, customerEmail]);

    // Effect for auto-loading messages on email change (with debounce)
    useEffect(() => {
        const debounceLoad = setTimeout(() => {
            if (customerEmail) {
                loadUserReviews();
            }
        }, 800);
        return () => clearTimeout(debounceLoad);
    }, [customerEmail, loadUserReviews]);

    // ==================== Handlers & Logic ====================

    const handleFormChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleRatingClick = (rating) => {
        setFormData(prev => ({ ...prev, rating }));
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        if (formData.rating === 0) {
            alert('Please select a rating');
            return;
        }
        if (!formData.productType) {
            alert('Please select a product type');
            return;
        }

        setIsSubmitting(true);
        const method = editingReviewId ? 'PUT' : 'POST';
        const url = editingReviewId ? `${API_BASE_URL}/${editingReviewId}` : API_BASE_URL;

        const payload = {
            ...formData,
            productId: getCurrentProductId(),
            productName: getCurrentProductName(),
        };

        try {
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                alert(`Review ${editingReviewId ? 'updated' : 'submitted'} successfully! It will be visible after approval.`);

                // Reset form fields but preserve email
                setFormData(prev => ({
                    customerName: '',
                    email: prev.email,
                    rating: 0,
                    reviewTitle: '',
                    comment: '',
                    productType: '',
                    verifiedPurchase: false,
                }));
                setEditingReviewId(null);

                // Reload data
                loadReviewStatistics();
                loadReviews();
                loadUserReviews();
            } else {
                const errorText = await response.text();
                throw new Error(`Server error: ${response.status} - ${errorText}`);
            }
        } catch (error) {
            alert('Failed to submit review: ' + error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEditReview = (reviewId) => {
        const reviewToEdit = userReviews.find(r => r.id === reviewId);
        if (reviewToEdit) {
            setFormData({
                customerName: reviewToEdit.customerName || '',
                email: reviewToEdit.email || '',
                rating: reviewToEdit.rating || 0,
                reviewTitle: reviewToEdit.reviewTitle || '',
                comment: reviewToEdit.comment || '',
                productType: reviewToEdit.productType || '',
                verifiedPurchase: reviewToEdit.verifiedPurchase || false,
            });
            setEditingReviewId(reviewId);
            // Scroll to form (React way: use useRef)
            document.querySelector('.write-review-section').scrollIntoView({ behavior: 'smooth' });
            alert('Form populated with your review. Update the fields and click "Update Review".');
        }
    };

    const handleDeleteReview = async (reviewId) => {
        if (!window.confirm('Are you sure you want to delete this review?')) return;
        try {
            const response = await fetch(`${API_BASE_URL}/${reviewId}`, { method: 'DELETE' });
            if (response.ok) {
                alert('Review deleted successfully!');
                loadReviews();
                loadReviewStatistics();
                loadUserReviews();
            } else {
                throw new Error('Failed to delete review');
            }
        } catch (error) {
            alert('Error deleting review: ' + error.message);
        }
    };

    const handleClearAllMessages = async () => {
        if (!window.confirm('Delete all your reviews? This cannot be undone.')) return;
        if (!userReviews || userReviews.length === 0) return;

        try {
            await Promise.all(userReviews.map(review =>
                fetch(`${API_BASE_URL}/${review.id}`, { method: 'DELETE' })
            ));
            alert('All your reviews have been cleared!');
            loadReviews();
            loadReviewStatistics();
            loadUserReviews();
        } catch (error) {
            alert('Error clearing reviews: ' + error.message);
        }
    };

    const handleMarkHelpful = async (reviewId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/${reviewId}/helpful`, { method: 'POST' });
            if (response.ok) {
                loadReviews();
            }
        } catch (error) {
            console.error('Error marking review as helpful:', error);
        }
    };

    // ==================== Memoized Filtered & Sorted Reviews ====================

    const filteredAndSortedReviews = useMemo(() => {
        if (!reviews) return null;

        let result = reviews;

        // 1. Filtering
        if (filterBy !== 'all') {
            const filterRating = parseInt(filterBy);
            result = result.filter(review => review.rating === filterRating);
        }

        // 2. Sorting
        const sorted = [...result];
        switch (sortBy) {
            case 'newest':
                return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            case 'highest':
                return sorted.sort((a, b) => b.rating - a.rating);
            case 'lowest':
                return sorted.sort((a, b) => a.rating - b.rating);
            case 'relevance':
            default:
                // Relevance is based on rating and helpful votes
                return sorted.sort((a, b) => {
                    const scoreA = (a.rating || 0) * 2 + (a.helpfulVotes || 0);
                    const scoreB = (b.rating || 0) * 2 + (b.helpfulVotes || 0);
                    return scoreB - scoreA;
                });
        }
    }, [reviews, filterBy, sortBy]);

    // ==================== Render Helpers ====================

    const RenderRatingDistribution = () => {
        if (!stats || stats.totalReviews === 0) {
            return <p style={{ color: '#aaa' }}>No data to show.</p>;
        }

        return (
            <div className="rating-distribution">
                {[5, 4, 3, 2, 1].map(i => {
                    const count = stats.ratingDistribution?.[i] || 0;
                    const percentage = (count / stats.totalReviews) * 100;
                    return (
                        <div key={i} className="rating-bar">
                            <div className="stars">{generateStarRating(i)}</div>
                            <div className="bar-container">
                                <div className="bar-fill" style={{ width: `${percentage}%` }}></div>
                            </div>
                            <div className="count">{count}</div>
                        </div>
                    );
                })}
            </div>
        );
    };

    const RenderReviewsList = () => {
        if (reviews === null) {
            return (
                <div className="no-reviews">
                    <i className="fas fa-comments"></i>
                    <p>Loading reviews...</p>
                </div>
            );
        }

        if (filteredAndSortedReviews?.length === 0) {
            return (
                <div className="no-reviews">
                    <i className="fas fa-comments"></i>
                    <p>No reviews match the current filters.</p>
                </div>
            );
        }

        return filteredAndSortedReviews.map(review => {
            const maskedName = review.customerName ?
                review.customerName.charAt(0) + '***' + (review.customerName.length > 1 ? review.customerName.charAt(review.customerName.length - 1) : '') :
                'U***r';

            return (
                <div key={review.id} className="review-item">
                    <div className="review-header">
                        <div className="reviewer-info">
                            <div className="reviewer-avatar">{review.customerName ? review.customerName.charAt(0).toUpperCase() : 'U'}</div>
                            <div className="reviewer-details">
                                <div className="reviewer-name">
                                    {maskedName}
                                    {review.verifiedPurchase && <span className="verified-badge">Verified Purchase</span>}
                                </div>
                                <div className="review-date">{formatDate(new Date(review.createdAt))}</div>
                            </div>
                        </div>
                        <div className="review-rating">{generateStarRating(review.rating)}</div>
                    </div>

                    <div className="review-content">
                        <strong>{escapeHtml(review.reviewTitle)}</strong>
                        <p>{escapeHtml(review.comment)}</p>
                    </div>

                    <div className="review-actions">
                        <button
                            className="helpful-btn"
                            onClick={() => handleMarkHelpful(review.id)}
                            id={`helpful-${review.id}`}
                        >
                            <i className="fas fa-thumbs-up"></i> Helpful ({review.helpfulVotes || 0})
                        </button>
                    </div>
                </div>
            );
        });
    };

    const RenderMessagesList = () => {
        if (userReviews === null) {
            return (
                <div className="messages-loading">
                    <i className="fas fa-spinner fa-spin"></i>
                    <p>Loading your reviews...</p>
                </div>
            );
        }

        if (!customerEmail) {
            return (
                <div className="empty-messages">
                    <i className="fas fa-envelope"></i>
                    <p>Enter your email to see reviews</p>
                    <small>Your email is used to find your submitted reviews</small>
                </div>
            );
        }

        if (userReviews.length === 0) {
            return (
                <div className="empty-messages">
                    <i className="fas fa-inbox"></i>
                    <p>No reviews found for this email</p>
                    <small>Submit a review to see it here</small>
                </div>
            );
        }

        return userReviews.map(msg => {
            const isApproved = msg.status === 'APPROVED';
            const statusClass = isApproved ? 'approved' : 'pending';
            const statusText = isApproved ? '✓ Approved' : '⏳ Pending';

            return (
                <div key={msg.id} className="message-item">
                    <div className="message-header">
                        <div className="message-sender">{escapeHtml(msg.productType || 'No Product')}</div>
                        <div className="message-date">{formatMessageDate(new Date(msg.createdAt))}</div>
                    </div>
                    <div className="message-preview">
                        <strong>{escapeHtml(msg.reviewTitle || 'No Title')}</strong>
                        <p style={{ marginTop: '5px', fontSize: '11px', opacity: 0.8 }}>
                            {escapeHtml(msg.comment ? (msg.comment.substring(0, 80) + (msg.comment.length > 80 ? '...' : '')) : 'No comment')}
                        </p>
                    </div>
                    <div className="message-meta">
                        <span><i className="fas fa-star" style={{ color: '#ffa500' }}></i> {msg.rating}/5</span>
                        <span className={`status-${statusClass}`}>{statusText}</span>
                        {msg.verifiedPurchase && <span className="verified-badge" style={{ fontSize: '9px', padding: '1px 4px' }}>Verified</span>}
                    </div>
                    <div className="message-actions">
                        <button
                            className="edit-btn"
                            onClick={() => handleEditReview(msg.id)}
                            title="Edit review"
                            disabled={isApproved}
                        >
                            <i className="fas fa-edit"></i> Edit
                        </button>
                        <button
                            className="delete-btn"
                            onClick={() => handleDeleteReview(msg.id)}
                            title="Delete review"
                        >
                            <i className="fas fa-trash"></i> Delete
                        </button>
                    </div>
                </div>
            );
        });
    };

    // ==================== Main Render ====================

    const avgRating = stats?.averageRating || 0;
    const totalCount = stats?.totalReviews || 0;

    return (
        <div className="review-container">
            {/* Rating Header */}
            <div className="rating-header">
                <div className="overall-rating">
                    <div className="rating-score">{avgRating.toFixed(1)}</div>
                    <div className="rating-stars-large">
                        {generateStarRating(Math.round(avgRating))}
                    </div>
                    <div className="total-ratings">{totalCount} {totalCount === 1 ? 'Rating' : 'Ratings'}</div>
                </div>
                <RenderRatingDistribution />
            </div>

            {/* Reviews Section */}
            <div className="reviews-section">
                <h2 className="section-title">Product Reviews</h2>

                <div className="review-filters">
                    <div className="sort-filter">
                        <select className="sort-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                            <option value="relevance">Sort: Relevance</option>
                            <option value="newest">Newest First</option>
                            <option value="highest">Highest Rating</option>
                            <option value="lowest">Lowest Rating</option>
                        </select>
                        <select className="filter-select" value={filterBy} onChange={(e) => setFilterBy(e.target.value)}>
                            <option value="all">Filter: All stars</option>
                            <option value="5">5 stars only</option>
                            <option value="4">4 stars only</option>
                            <option value="3">3 stars only</option>
                            <option value="2">2 stars only</option>
                            <option value="1">1 star only</option>
                        </select>
                    </div>
                </div>

                <div className="reviews-list">
                    <RenderReviewsList />
                </div>
            </div>

            {/* Write Review Section */}
            <div className="write-review-section">
                <h3 className="write-review-title">{editingReviewId ? 'Edit Your Review' : 'Write a Review'}</h3>
                <form className="review-form" onSubmit={handleFormSubmit}>
                    <div className="form-group">
                        <label>Your Name *</label>
                        <input type="text" name="customerName" required
                            value={formData.customerName} onChange={handleFormChange}
                            placeholder="Enter your name" />
                    </div>

                    <div className="form-group">
                        <label>Your Email *</label>
                        <input type="email" name="email" required
                            value={formData.email} onChange={handleFormChange}
                            placeholder="Enter your email" />
                    </div>

                    <div className="form-group">
                        <label>Product Type *</label>
                        <select name="productType" required
                            value={formData.productType} onChange={handleFormChange}>
                            <option value="">Select Product Type</option>
                            {PRODUCT_OPTIONS.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Your Rating *</label>
                        <div className="star-rating">
                            {[1, 2, 3, 4, 5].map(rating => (
                                <span
                                    key={rating}
                                    className={`star ${formData.rating >= rating ? 'active' : ''}`}
                                    onClick={() => handleRatingClick(rating)}
                                    onMouseEnter={() => {}}
                                >
                                    ★
                                </span>
                            ))}
                        </div>
                        <input type="hidden" name="rating" value={formData.rating} required />
                    </div>

                    <div className="form-group">
                        <label>Review Title *</label>
                        <input type="text" name="reviewTitle" required maxLength="200"
                            value={formData.reviewTitle} onChange={handleFormChange}
                            placeholder="Summarize your experience" />
                    </div>

                    <div className="form-group">
                        <label>Your Review *</label>
                        <textarea name="comment" required maxLength="1000"
                            value={formData.comment} onChange={handleFormChange}
                            placeholder="Share details of your experience with this product"></textarea>
                    </div>

                    <div className="checkbox-group">
                        <input type="checkbox" name="verifiedPurchase"
                            checked={formData.verifiedPurchase} onChange={handleFormChange} />
                        <label>I made a verified purchase</label>
                    </div>

                    

                    <button type="submit" className="submit-btn" disabled={isSubmitting}>
                        {isSubmitting ? 'Processing...' : (editingReviewId ? 'Update Review' : 'Submit Review')}
                    </button>
                    
                    {/* Compact Messages Panel */}
                                    <div className={`compact-messages-panel ${isPanelOpen ? 'open' : ''}`} style={{ display: customerEmail || isPanelOpen ? 'block' : 'none' }}>
                                        <div className="panel-header" onClick={() => setIsPanelOpen(prev => !prev)}>
                                            <div className="header-info">
                                                <i className="fas fa-comments"></i>
                                                <span>Your Reviews</span>
                                                <span className="message-badge">{userReviews ? userReviews.length : 0}</span>
                                            </div>
                                            <i className="fas fa-chevron-down" style={{ transform: isPanelOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}></i>
                                        </div>
                                        <div className="panel-content">
                                            <div className="messages-list">
                                                <RenderMessagesList />
                                            </div>
                                            <div className="panel-actions">
                                                <button className="refresh-btn-small" onClick={loadUserReviews} title="Refresh reviews">
                                                    <i className="fas fa-sync-alt"></i>
                                                </button>
                                                <button className="clear-all-btn" onClick={handleClearAllMessages} title="Clear all reviews" disabled={!userReviews || userReviews.length === 0}>
                                                    <i className="fas fa-trash"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                </form>


            </div>
        </div>
    );
};

export default ProductReview;
