import React, { useState, useEffect, useCallback } from 'react';
import './ContactUs.css';
import { showAlert, escapeHtml, formatMessageDate } from '../utils/contactUtils';
import { COUNTRIES } from '../utils/countries'; // Assuming countries array is moved here

// API Base URL
const API_BASE_URL = '/api';

// Phone numbers and Emails (extracted from HTML for modals)
const PHONE_NUMBERS = [
    "+94 913 099 670", "+94 914 943 668", "+94 777 369 330",
    "+94 912 257 949", "+94 776 306 861", "+94 777 641 659", "+94 718 307 540"
];
const EMAIL_ADDRESSES = ["sales@topcinnamon.com", "info@topcinnamon.com"];

// ===================================================================
// Main Component
// ===================================================================

const ContactUs = () => {
    // Form State
    const [formData, setFormData] = useState({
        name: '', email: '', phone: '', country: '', subject: '', message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [alert, setAlert] = useState({ message: '', type: '' });
    const [editingMessageId, setEditingMessageId] = useState(null);

    // Messages Panel State
    const [userMessages, setUserMessages] = useState(null); // null means loading
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [editToken, setEditToken] = useState(localStorage.getItem('editToken'));

    // Modal State
    const [modal, setModal] = useState({ id: null, data: null });
    const [mapAddress, setMapAddress] = useState('G.D.De Silva Sons, No 51, Sri Subadrarama Road, Balapitiya, Sri Lanka');

    // ==================== API Callbacks ====================

    const loadMessages = useCallback(async () => {
        if (!editToken) {
            setUserMessages([]);
            return;
        }

        setUserMessages(null);
        try {
            const response = await fetch(`${API_BASE_URL}/contact/submissions?token=${editToken}`);

            if (!response.ok) throw new Error(`Server returned ${response.status}: ${await response.text()}`);

            const messages = await response.json();
            messages.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setUserMessages(messages);

            if (messages.length > 0) {
                // Ensure panel is open if messages exist
                if (!isPanelOpen) {
                    setIsPanelOpen(true);
                }
            }

        } catch (error) {
            console.error('❌ Error loading messages:', error);
            setUserMessages([]); // Set to empty array on error
            // Use local alert function for user feedback (optional here)
        }
    }, [editToken, isPanelOpen]);

    // ==================== Effects & Init ====================

    useEffect(() => {
        // Load messages if token exists on component mount
        if (editToken) {
            loadMessages();
        }

        // Initialize mobile menu toggle (manual DOM interaction for simplicity)
        const mobileToggle = document.querySelector('.mobile-toggle');
        const navLinks = document.querySelector('.nav-links');
        const toggleHandler = () => navLinks.classList.toggle('active');

        if (mobileToggle && navLinks) {
            mobileToggle.addEventListener('click', toggleHandler);
        }

        return () => {
            if (mobileToggle && navLinks) {
                mobileToggle.removeEventListener('click', toggleHandler);
            }
        };
    }, [editToken, loadMessages]);


    // ==================== Form Handlers ====================

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        // Basic client-side validation
        if (Object.values(formData).some(val => !val)) {
            showAlert(setAlert, 'Please fill in all required fields', 'error');
            return;
        }

        setIsSubmitting(true);
        setAlert({ message: '', type: '' });

        try {
            if (editingMessageId) {
                // UPDATE existing message
                const response = await fetch(`${API_BASE_URL}/contact/${editingMessageId}/edit`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ...formData, editToken })
                });

                if (!response.ok) throw new Error(`Server error: ${response.status} - ${await response.text()}`);
                
                const result = await response.json();
                showAlert(setAlert, result.message || 'Message updated successfully!', 'success');
                
                // Reset form state and editing mode
                setFormData({ name: '', email: '', phone: '', country: '', subject: '', message: '' });
                setEditingMessageId(null);

            } else {
                // NEW SUBMISSION
                const response = await fetch(`${API_BASE_URL}/contact`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });

                if (!response.ok) throw new Error(`Server error: ${response.status} - ${await response.text()}`);

                const result = await response.json();
                showAlert(setAlert, result.message || 'Message sent successfully!', 'success');

                // Update local storage and state with the new token
                if (result.editToken) {
                    localStorage.setItem('editToken', result.editToken);
                    setEditToken(result.editToken);
                }
            }

            // Always reload messages after submission/update
            loadMessages();
            setFormData({ name: '', email: '', phone: '', country: '', subject: '', message: '' }); // Clear fields after submission
            setEditingMessageId(null);


        } catch (error) {
            let errorMessage = 'Error submitting form: ' + error.message;
            if (error.message.includes('Failed to fetch')) {
                errorMessage = '❌ Cannot connect to backend server. Please check if Spring Boot is running on port 8082.';
            }
            showAlert(setAlert, errorMessage, 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    // ==================== Messages Panel Handlers ====================

    const toggleMessagesPanel = () => {
        const newState = !isPanelOpen;
        setIsPanelOpen(newState);
        if (newState) {
            loadMessages();
        }
    };

    const handleEditMessage = async (messageId) => {
        if (!editToken) return;

        try {
            // NOTE: The original script used /contact/edit/{token} to fetch *a* message.
            // Assuming your backend supports fetching by ID if the token is present for security.
            const messageToEdit = userMessages.find(msg => msg.id === messageId);
            
            if (!messageToEdit || messageToEdit.canEdit === false) {
                 showAlert(setAlert, 'Cannot edit: message not found or edit time expired.', 'error');
                 return;
            }

            setFormData({
                name: messageToEdit.name || '',
                email: messageToEdit.email || '',
                phone: messageToEdit.phone || '',
                country: messageToEdit.country || '',
                subject: messageToEdit.subject || '',
                message: messageToEdit.message || '',
            });

            setEditingMessageId(messageId);
            // Scroll to form (use a ref in a real app, but using window for conversion simplicity)
            window.scrollTo({ top: 0, behavior: 'smooth' });

            showAlert(setAlert, 'Form populated with your message. Update the fields and click "Update Message".', 'success');

        } catch (error) {
            showAlert(setAlert, 'Error loading message for editing: ' + error.message, 'error');
        }
    };

    const handleDeleteMessage = async (messageId) => {
        if (!window.confirm('Delete this message?')) return;
        if (!editToken) return;

        try {
            const response = await fetch(`${API_BASE_URL}/contact/submissions/${messageId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${editToken}` }
            });

            if (!response.ok) throw new Error('Failed to delete message');

            showAlert(setAlert, 'Message deleted!', 'success');
            loadMessages();

        } catch (error) {
            showAlert(setAlert, 'Error deleting message: ' + error.message, 'error');
        }
    };

    const handleClearAllMessages = async () => {
        if (!window.confirm('Delete all messages? This cannot be undone.')) return;
        if (!editToken || !userMessages || userMessages.length === 0) return;

        try {
            await Promise.all(userMessages.map(message =>
                fetch(`${API_BASE_URL}/contact/submissions/${message.id}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${editToken}` }
                })
            ));

            showAlert(setAlert, 'All messages cleared!', 'success');
            loadMessages();

        } catch (error) {
            showAlert(setAlert, 'Error clearing messages: ' + error.message, 'error');
        }
    };

    // ==================== Other UI Handlers ====================

    const updateMap = (address) => {
        setMapAddress(address);
    };

    const showCallModal = () => {
        setModal({ id: 'callModal', data: PHONE_NUMBERS });
    };

    const closeCallModal = () => {
        setModal({ id: null, data: null });
    };

    // ==================== JSX Render Helpers ====================

    const RenderMessagesList = () => {
        if (userMessages === null) {
            return (
                <div className="messages-loading">
                    <i className="fas fa-spinner fa-spin"></i>
                    <p>Loading messages...</p>
                </div>
            );
        }

        if (userMessages.length === 0) {
            return (
                <div className="empty-messages">
                    <i className="fas fa-inbox"></i>
                    <p>No messages found</p>
                    <small>Submit a contact form to see your messages here</small>
                </div>
            );
        }

        return userMessages.map(msg => {
            const statusClass = msg.reviewed ? 'reviewed' : 'pending';
            const editTimeClass = msg.canEdit === false ? 'expired' : 'active';

            return (
                <div key={msg.id} className="message-item">
                    <div className="message-header">
                        <div className="message-sender">{escapeHtml(msg.name || 'No Name')}</div>
                        <div className="message-date">{formatMessageDate(msg.createdAt)}</div>
                    </div>
                    {msg.subject && (
                        <div className="message-preview">
                            {escapeHtml(msg.subject)}
                        </div>
                    )}
                    <div className="message-meta">
                        <span><i className="fas fa-envelope"></i> {escapeHtml(msg.email || 'No Email')}</span>
                        <span><i className="fas fa-globe"></i> {escapeHtml(msg.country || 'No Country')}</span>
                    </div>
                    <div className="message-status">
                        <span className={`status-${statusClass}`}>
                            {msg.reviewed ? '✓ Reviewed' : '⏳ Pending'}
                        </span>
                        <span className={`edit-time ${editTimeClass}`}>
                            {msg.canEdit === false ? '✗ Edit expired' : '✓ Can edit'}
                        </span>
                    </div>
                    <div className="message-actions">
                        <button
                            className="edit-btn"
                            onClick={() => handleEditMessage(msg.id)}
                            title="Edit message"
                            disabled={msg.canEdit === false}
                        >
                            <i className="fas fa-edit"></i> Edit
                        </button>
                        <button
                            className="delete-btn"
                            onClick={() => handleDeleteMessage(msg.id)}
                            title="Delete message"
                        >
                            <i className="fas fa-trash"></i> Delete
                        </button>
                    </div>
                </div>
            );
        });
    };

    return (
        <>
            <Header />
            <section className="hero">
                <div className="container">
                    <h1 className="fade-in">Connect With The Cinnamon Experts</h1>
                    <p className="fade-in delay-1">We're here to answer any questions you may have about our premium cinnamon products.</p>
                </div>
            </section>
            <section className="contact-section">
                <div className="container">
                    <div className="section-title fade-in">
                        <h2>Get In Touch</h2>
                        <p>Have questions about our cinnamon products or need assistance? Our team is ready to help you.</p>
                    </div>
                    <div className="contact-wrapper">
                        <div className="contact-form fade-in">
                            <h3>{editingMessageId ? 'Update Your Message' : 'Send Us a Message'}</h3>
                            <form onSubmit={handleFormSubmit}>
                                {/* Alert for messages */}
                                {alert.message && (
                                    <div className={`alert alert-${alert.type}`} style={{ display: 'block' }}>
                                        {alert.message}
                                    </div>
                                )}
                                {/* Form Groups */}
                                <FormGroup label="User Name" id="name" type="text" value={formData.name} onChange={handleFormChange} required />
                                <FormGroup label="Email Address" id="email" type="email" value={formData.email} onChange={handleFormChange} required />
                                <FormGroup label="Phone Number" id="phone" type="tel" value={formData.phone} onChange={handleFormChange} required />
                                <FormGroupSelect label="Country" id="country" value={formData.country} onChange={handleFormChange} required options={COUNTRIES} />
                                <FormGroup label="Subject" id="subject" type="text" value={formData.subject} onChange={handleFormChange} required />
                                <FormGroup label="Message" id="message" isTextarea value={formData.message} onChange={handleFormChange} required />

                                <button type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? 'Processing...' : (editingMessageId ? 'Update Message' : 'Send Message')}
                                </button>
                                
                                {/* Compact Messages Panel */}
                                {editToken && (
                                    <div className={`compact-messages-panel ${isPanelOpen ? 'open' : ''}`}>
                                        <div className="panel-header" onClick={toggleMessagesPanel}>
                                            <div className="header-info">
                                                <i className="fas fa-comments"></i>
                                                <span>Your Messages</span>
                                                <span className="message-badge">{userMessages ? userMessages.length : 0}</span>
                                            </div>
                                            <i className="fas fa-chevron-down" style={{ transform: isPanelOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}></i>
                                        </div>
                                        <div className="panel-content" style={{ maxHeight: isPanelOpen ? '350px' : '0' }}>
                                            <div className="messages-list">
                                                <RenderMessagesList />
                                            </div>
                                            <div className="panel-actions">
                                                <button className="refresh-btn-small" onClick={loadMessages}><i className="fas fa-sync-alt"></i></button>
                                                <button className="clear-all-btn" onClick={handleClearAllMessages} disabled={!userMessages || userMessages.length === 0}><i className="fas fa-trash"></i></button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </form>
                        </div>
                        
                        <ContactInfo updateMap={updateMap} showCallModal={showCallModal} />
                    </div>
                </div>
            </section>
            <MapSection mapAddress={mapAddress} />
            <Footer />
            
            {/* Modals */}
            {modal.id === 'callModal' && (
                <Modal id="callModal" title="Choose a number to call:" onClose={closeCallModal}>
                    {modal.data.map(number => (
                        <button key={number} className="callBtn" onClick={() => window.location.href = `tel:${number}`}>{number}</button>
                    ))}
                    <button className="cancelBtn" onClick={closeCallModal}>Cancel</button>
                </Modal>
            )}
        </>
    );
};

// ==================== Sub-Components ====================

const Header = () => (
    <header className="header">
        <div className="container">
            <nav className="navbar">
                <div className="logo">G.D. <span>DE SILVA</span> SONS</div>
                <ul className="nav-links">
                    <li><a href="#">Home</a></li>
                    <li><a href="#">About Us</a></li>
                    <li><a href="#">Products</a></li>
                    <li><a href="#" className="active">Contact</a></li>
                </ul>
                <div className="mobile-toggle"><i className="fas fa-bars"></i></div>
            </nav>
        </div>
    </header>
);

const FormGroup = ({ label, id, type, value, onChange, required, isTextarea }) => (
    <div className="form-group">
        <label htmlFor={id}>{label}</label>
        {isTextarea ? (
            <textarea id={id} name={id} value={value} onChange={onChange} required={required} />
        ) : (
            <input type={type} id={id} name={id} value={value} onChange={onChange} required={required} />
        )}
    </div>
);

const FormGroupSelect = ({ label, id, value, onChange, required, options }) => (
    <div className="form-group">
        <label htmlFor={id}>{label}</label>
        <select id={id} name={id} value={value} onChange={onChange} required={required}>
            <option value="">-- Select Country --</option>
            {options.map(country => (
                <option key={country.value} value={country.value}>{country.label}</option>
            ))}
        </select>
    </div>
);

const ContactInfoItem = ({ icon, title, content, isLink, linkHref, onClick }) => (
    <div className="info-item fade-in delay-1" onClick={onClick}>
        <div className="icon"><i className={`fas fa-${icon}`}></i></div>
        <div>
            <h3>{title}</h3>
            {content.map((item, index) => (
                isLink ? (
                    <p key={index}><a href={linkHref ? linkHref[index] : item.startsWith('tel:') ? item : `mailto:${item}`} className="contact-link">{item.startsWith('tel:') ? item.replace('tel:', '') : item}</a></p>
                ) : (
                    <p key={index}>{item}</p>
                )
            ))}
        </div>
    </div>
);

const ContactInfo = ({ updateMap, showCallModal }) => (
    <div className="contact-info">
        <h3 className="fade-in">Contact Information</h3>
        {/* Addresses */}
        <div className="info-item fade-in delay-1">
            <div className="icon"><i className="fas fa-map-marker-alt"></i></div>
            <div>
                <h3>Office Address</h3>
                <p><a onClick={() => updateMap('G.D.De Silva Sons, No 51, Sri Subadrarama Road, Balapitiya, Sri Lanka')} className="contact-link">G.D.De Silva Sons, No 51, Sri Subadrarama Road, Balapitiya, Sri Lanka</a></p>
            </div>
        </div>
        <div className="info-item fade-in delay-2">
            <div className="icon"><i className="fas fa-industry"></i></div>
            <div>
                <h3>Factory Address</h3>
                <p><a onClick={() => updateMap('G.D.De Silva Sons, Diggoda, Ahungalla, Sri Lanka')} className="contact-link">G.D.De Silva Sons, Diggoda, Ahungalla, Sri Lanka</a></p>
            </div>
        </div>
        {/* Phone */}
        <div className="info-item fade-in delay-1">
            <div className="icon" onClick={showCallModal}><i className="fas fa-phone"></i></div>
            <div>
                <h3>Phone Numbers</h3>
                {PHONE_NUMBERS.map((num, index) => (
                    <p key={index}><a href={`tel:${num.replace(/\s/g, '')}`} className="contact-link">{num}</a></p>
                ))}
                <p><small style={{ color: '#CD853F', fontStyle: 'italic' }}>Click any number to call directly</small></p>
            </div>
        </div>
        {/* Fax */}
        <div className="info-item fade-in delay-2">
            <div className="icon"><i className="fas fa-fax"></i></div>
            <div>
                <h3>Fax</h3>
                <p><a href="tel:+94912257614" className="contact-link">+94 912 257 614</a></p>
                <p><small style={{ color: '#CD853F', fontStyle: 'italic' }}>Click to dial fax number</small></p>
            </div>
        </div>
        {/* Email */}
        <div className="info-item fade-in delay-1">
            <div className="icon"><i className="fas fa-envelope"></i></div>
            <div>
                <h3>Email Addresses</h3>
                {EMAIL_ADDRESSES.map((email, index) => (
                    <p key={index}><a href={`mailto:${email}`} className="contact-link">{email}</a></p>
                ))}
                <p><small style={{ color: '#CD853F', fontStyle: 'italic' }}>Click any email to send a message</small></p>
            </div>
        </div>
        {/* Skype */}
        <div className="info-item fade-in delay-2">
            <div className="icon"><i className="fab fa-skype"></i></div>
            <div>
                <h3>Skype</h3>
                <p><a href="skype:topcinnamon?call" className="contact-link">topcinnamon</a></p>
                <p><small style={{ color: '#CD853F', fontStyle: 'italic' }}>Click to start a Skype call</small></p>
            </div>
        </div>
    </div>
);

const MapSection = ({ mapAddress }) => {
    // Note: The original map src was a placeholder. 
    // This converts the address to a Google Maps search/embed URL.
    const encodedAddress = encodeURIComponent(mapAddress);
    const mapSrc = `https://maps.google.com/maps?q=${encodedAddress}&output=embed`;

    // Determine overlay text based on the current address
    const isOffice = mapAddress.includes('Office');

    return (
        <section className="map-section fade-in">
            <div className="container">
                <div className="map-container">
                    <div className="map">
                        <iframe
                            id="gmap"
                            src={mapSrc}
                            width="100%"
                            height="400"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            title="Location Map"
                        ></iframe>
                    </div>
                    <div className="map-overlay">
                        <h4>{isOffice ? 'Head Office' : 'Factory Location'}</h4>
                        <p>{isOffice ? 'G.D.De Silva Sons, No 51' : 'G.D.De Silva Sons'}</p>
                        <p>{isOffice ? 'Sri Subadrarama Road, Balapitiya' : 'Diggoda, Ahungalla'}</p>
                        <p>Sri Lanka</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

const Modal = ({ id, title, onClose, children }) => (
    <div id={id} className="modal" style={{ display: 'flex' }} onClick={(e) => e.target.id === id && onClose()}>
        <div className="modal-content">
            <h3>{title}</h3>
            <div id="callButtons">{children}</div>
        </div>
    </div>
);

const Footer = () => (
    <footer className="footer">
        <div className="container">
            <div className="footer-content">
                <div className="footer-section">
                    <h3>About Us</h3>
                    <p>G.D. De Silva Sons is a leading exporter of premium Ceylon cinnamon products, maintaining the highest quality standards for over three decades.</p>
                </div>
                <div className="footer-section">
                    <h3>Quick Links</h3>
                    <ul className="footer-links">
                        <li><a href="#">Home</a></li>
                        <li><a href="#">About Us</a></li>
                        <li><a href="#">Our Products</a></li>
                        <li><a href="#">Contact Us</a></li>
                    </ul>
                </div>
                <div className="footer-section">
                    <h3>Contact Info</h3>
                    <div className="contact-info-item">
                        <div className="contact-info-icon"><i className="fas fa-map-marker-alt"></i></div>
                        <div className="contact-info-content"><p>G.D.De Silva Sons, No 51, Sri Subadrarama Road, Balapitiya, Sri Lanka</p></div>
                    </div>
                    <div className="contact-info-item">
                        <div className="contact-info-icon"><i className="fas fa-phone"></i></div>
                        <div className="contact-info-content">
                        <p>
                            <a href="tel:+94913099670" className="contact-link">+94 913 099 670 - Factory</a>
                        <br />
                            <a href="tel:+94914943668" className="contact-link">+94 914 943 668 - Office</a>
                        </p>
                        </div>
                    </div>
                    <div className="contact-info-item">
                        <div className="contact-info-icon"><i className="fas fa-envelope"></i></div>
                        <div className="contact-info-content"><p><a href="mailto:sales@topcinnamon.com" className="contact-link">sales@topcinnamon.com</a></p></div>
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                <p>© 2023 G.D. De Silva Sons. All Rights Reserved. | Premium Ceylon Cinnamon Exporters</p>
            </div>
        </div>
    </footer>
);

export default ContactUs;
