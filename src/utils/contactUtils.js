// ==================== UTILITY FUNCTIONS ====================

export function showAlert(setAlert, message, type = 'success') {
    setAlert({ message, type });
    setTimeout(() => {
        setAlert({ message: '', type: '' });
    }, 5000);
}

export function escapeHtml(unsafe) {
    if (!unsafe) return '';
    // Simplified escape for basic display in React JSX to prevent XSS
    const str = String(unsafe);
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

export function formatMessageDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
