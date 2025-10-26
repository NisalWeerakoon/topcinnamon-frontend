// API Connection Test Script
// This script tests all the backend API endpoints used by the React frontend

const API_BASE_URL = 'http://localhost:8082/api';

// Test endpoints
const testEndpoints = [
    // Contact endpoints
    { method: 'GET', url: `${API_BASE_URL}/contact/test`, name: 'Contact Test' },
    { method: 'GET', url: `${API_BASE_URL}/contact/all-ordered`, name: 'Get All Contacts' },
    { method: 'GET', url: `${API_BASE_URL}/contact/admin/dashboard/stats`, name: 'Contact Dashboard Stats' },
    
    // Review endpoints
    { method: 'GET', url: `${API_BASE_URL}/reviews/test`, name: 'Review Test' },
    { method: 'GET', url: `${API_BASE_URL}/reviews/approved`, name: 'Get Approved Reviews' },
    { method: 'GET', url: `${API_BASE_URL}/reviews/statistics`, name: 'Review Statistics' },
    { method: 'GET', url: `${API_BASE_URL}/reviews/admin/all`, name: 'Get All Reviews (Admin)' },
    { method: 'GET', url: `${API_BASE_URL}/reviews/admin/dashboard/stats`, name: 'Review Dashboard Stats' },
];

// Test data for POST requests
const testContactData = {
    name: 'Test User',
    email: 'test@example.com',
    phone: '+1234567890',
    country: 'United States',
    subject: 'Test Subject',
    message: 'This is a test message'
};

const testReviewData = {
    customerName: 'Test Customer',
    email: 'test@example.com',
    rating: 5,
    reviewTitle: 'Great Product',
    comment: 'This is a test review',
    productType: 'C5',
    productId: 'test-product-001',
    productName: 'Test Product',
    verifiedPurchase: true
};

async function testEndpoint(endpoint) {
    try {
        console.log(`\n🧪 Testing ${endpoint.name}...`);
        console.log(`   ${endpoint.method} ${endpoint.url}`);
        
        const options = {
            method: endpoint.method,
            headers: {
                'Content-Type': 'application/json'
            }
        };
        
        if (endpoint.method === 'POST' && endpoint.data) {
            options.body = JSON.stringify(endpoint.data);
        }
        
        const response = await fetch(endpoint.url, options);
        const status = response.status;
        const statusText = response.statusText;
        
        if (response.ok) {
            const data = await response.json();
            console.log(`   ✅ SUCCESS (${status} ${statusText})`);
            console.log(`   📊 Response:`, data);
            return { success: true, status, data };
        } else {
            const errorText = await response.text();
            console.log(`   ❌ FAILED (${status} ${statusText})`);
            console.log(`   📄 Error:`, errorText);
            return { success: false, status, error: errorText };
        }
    } catch (error) {
        console.log(`   💥 ERROR: ${error.message}`);
        return { success: false, error: error.message };
    }
}

async function runAllTests() {
    console.log('🚀 Starting API Connection Tests...');
    console.log('=' .repeat(50));
    
    const results = [];
    
    // Test GET endpoints
    for (const endpoint of testEndpoints) {
        const result = await testEndpoint(endpoint);
        results.push({ ...endpoint, result });
    }
    
    // Test POST endpoints
    console.log('\n📝 Testing POST endpoints...');
    
    // Test contact submission
    const contactTest = await testEndpoint({
        method: 'POST',
        url: `${API_BASE_URL}/contact`,
        name: 'Submit Contact Form',
        data: testContactData
    });
    results.push({ method: 'POST', url: `${API_BASE_URL}/contact`, name: 'Submit Contact Form', result: contactTest });
    
    // Test review submission
    const reviewTest = await testEndpoint({
        method: 'POST',
        url: `${API_BASE_URL}/reviews`,
        name: 'Submit Review',
        data: testReviewData
    });
    results.push({ method: 'POST', url: `${API_BASE_URL}/reviews`, name: 'Submit Review', result: reviewTest });
    
    // Summary
    console.log('\n📊 TEST SUMMARY');
    console.log('=' .repeat(50));
    
    const successful = results.filter(r => r.result.success).length;
    const failed = results.filter(r => !r.result.success).length;
    
    console.log(`✅ Successful: ${successful}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`📈 Success Rate: ${Math.round((successful / results.length) * 100)}%`);
    
    if (failed > 0) {
        console.log('\n❌ FAILED TESTS:');
        results.filter(r => !r.result.success).forEach(r => {
            console.log(`   - ${r.name}: ${r.result.error || r.result.status}`);
        });
    }
    
    console.log('\n🎯 Test completed!');
}

// Run tests if this script is executed directly
if (typeof window === 'undefined') {
    // Node.js environment
    const fetch = require('node-fetch');
    runAllTests().catch(console.error);
} else {
    // Browser environment
    runAllTests().catch(console.error);
}
