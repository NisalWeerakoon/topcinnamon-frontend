# Frontend-Backend API Connections Summary

## Overview
This document summarizes all the API connections between the React frontend and Spring Boot backend for the Cinnamon Products application.

## Backend Base URL
- **Development**: `http://localhost:8082/api`
- **Production**: To be configured based on deployment

## API Endpoints

### Contact Management

#### 1. Contact Form Submission
- **Endpoint**: `POST /api/contact`
- **Frontend Component**: `ContactUs.jsx`
- **Purpose**: Submit new contact form
- **Request Body**:
  ```json
  {
    "name": "string",
    "email": "string", 
    "phone": "string",
    "country": "string",
    "subject": "string",
    "message": "string"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Message sent successfully!",
    "submissionId": "number",
    "editToken": "string",
    "editAllowedUntil": "datetime"
  }
  ```

#### 2. Get User Submissions
- **Endpoint**: `GET /api/contact/submissions?token={editToken}`
- **Frontend Component**: `ContactUs.jsx`
- **Purpose**: Retrieve user's previous submissions using edit token

#### 3. Edit Contact Submission
- **Endpoint**: `PUT /api/contact/{id}/edit`
- **Frontend Component**: `ContactUs.jsx`
- **Purpose**: Update existing contact submission
- **Request Body**:
  ```json
  {
    "name": "string",
    "email": "string",
    "phone": "string", 
    "country": "string",
    "subject": "string",
    "message": "string",
    "editToken": "string"
  }
  ```

#### 4. Delete User Submission
- **Endpoint**: `DELETE /api/contact/submissions/{id}`
- **Frontend Component**: `ContactUs.jsx`
- **Headers**: `Authorization: Bearer {editToken}`

#### 5. Get All Contacts (Admin)
- **Endpoint**: `GET /api/contact/all-ordered`
- **Frontend Component**: `AdminDashboard.jsx`
- **Purpose**: Retrieve all contact submissions for admin dashboard

#### 6. Update Contact Status (Admin)
- **Endpoint**: `PUT /api/contact/admin/{id}/status`
- **Frontend Component**: `AdminDashboard.jsx`
- **Request Body**:
  ```json
  {
    "status": "string",
    "adminNotes": "string"
  }
  ```

#### 7. Delete Contact (Admin)
- **Endpoint**: `DELETE /api/contact/admin/{id}`
- **Frontend Component**: `AdminDashboard.jsx`

#### 8. Contact Dashboard Stats
- **Endpoint**: `GET /api/contact/admin/dashboard/stats`
- **Frontend Component**: `AdminDashboard.jsx`

### Review Management

#### 1. Submit Review
- **Endpoint**: `POST /api/reviews`
- **Frontend Component**: `ProductReview.jsx`
- **Request Body**:
  ```json
  {
    "customerName": "string",
    "email": "string",
    "rating": "number",
    "reviewTitle": "string",
    "comment": "string",
    "productType": "string",
    "productId": "string",
    "productName": "string",
    "verifiedPurchase": "boolean"
  }
  ```

#### 2. Get Approved Reviews
- **Endpoint**: `GET /api/reviews/approved`
- **Frontend Component**: `ProductReview.jsx`
- **Purpose**: Display approved reviews to public

#### 3. Get Review Statistics
- **Endpoint**: `GET /api/reviews/statistics`
- **Frontend Component**: `ProductReview.jsx`
- **Purpose**: Get rating statistics for display

#### 4. Update Review
- **Endpoint**: `PUT /api/reviews/{id}`
- **Frontend Component**: `ProductReview.jsx`
- **Request Body**:
  ```json
  {
    "customerName": "string",
    "email": "string",
    "rating": "number",
    "reviewTitle": "string",
    "comment": "string",
    "productType": "string",
    "verifiedPurchase": "boolean",
    "editToken": "string"
  }
  ```

#### 5. Delete Review
- **Endpoint**: `DELETE /api/reviews/{id}?editToken={token}`
- **Frontend Component**: `ProductReview.jsx`

#### 6. Mark Review as Helpful
- **Endpoint**: `POST /api/reviews/{id}/helpful`
- **Frontend Component**: `ProductReview.jsx`

#### 7. Get All Reviews (Admin)
- **Endpoint**: `GET /api/reviews/admin/all`
- **Frontend Component**: `AdminDashboard.jsx`, `ProductReview.jsx`

#### 8. Get Review Details (Admin)
- **Endpoint**: `GET /api/reviews/admin/{id}/details`
- **Frontend Component**: `AdminDashboard.jsx`

#### 9. Approve Review (Admin)
- **Endpoint**: `POST /api/reviews/admin/{id}/approve`
- **Frontend Component**: `AdminDashboard.jsx`
- **Request Body**:
  ```json
  {
    "adminNotes": "string"
  }
  ```

#### 10. Reject Review (Admin)
- **Endpoint**: `POST /api/reviews/admin/{id}/reject`
- **Frontend Component**: `AdminDashboard.jsx`
- **Request Body**:
  ```json
  {
    "adminNotes": "string"
  }
  ```

#### 11. Mark Review as Under Review (Admin)
- **Endpoint**: `POST /api/reviews/admin/{id}/start-review`
- **Frontend Component**: `AdminDashboard.jsx`

#### 12. Delete Review (Admin)
- **Endpoint**: `DELETE /api/reviews/admin/{id}`
- **Frontend Component**: `AdminDashboard.jsx`

#### 13. Review Dashboard Stats
- **Endpoint**: `GET /api/reviews/admin/dashboard/stats`
- **Frontend Component**: `AdminDashboard.jsx`

## CORS Configuration

The backend is configured to allow cross-origin requests from:
- **Development**: `http://localhost:3000` (React dev server)
- **Production**: To be configured based on deployment

## Error Handling

All API calls include proper error handling:
- Network errors (connection refused, timeout)
- HTTP error responses (4xx, 5xx)
- JSON parsing errors
- Validation errors

## Testing

### Test Files Created:
1. `test-api-connections.js` - Node.js test script
2. `test-api.html` - Browser-based test interface

### How to Test:
1. Start the backend server on port 8082
2. Open `test-api.html` in a browser
3. Click "Run All Tests" to verify all endpoints

## Status Codes

### Success Responses:
- `200 OK` - Successful GET/PUT requests
- `201 Created` - Successful POST requests

### Error Responses:
- `400 Bad Request` - Validation errors, invalid data
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server-side errors

## Security Considerations

1. **Edit Tokens**: Used for user authentication when editing/deleting their own submissions
2. **CORS**: Properly configured to allow frontend requests
3. **Input Validation**: All inputs are validated on both frontend and backend
4. **XSS Protection**: HTML escaping implemented in utility functions

## Frontend Components Updated

### ContactUs.jsx
- ✅ API base URL configured
- ✅ Form submission to `/api/contact`
- ✅ User submissions retrieval
- ✅ Edit/delete functionality
- ✅ Error handling and user feedback

### ProductReview.jsx  
- ✅ API base URL configured
- ✅ Review submission to `/api/reviews`
- ✅ Approved reviews display
- ✅ Statistics loading
- ✅ User review management
- ✅ Helpful voting functionality

### AdminDashboard.jsx
- ✅ API base URL configured
- ✅ Dashboard statistics
- ✅ Contact management
- ✅ Review management
- ✅ Export functionality
- ✅ Bulk operations

## Next Steps

1. **Test the connections** using the provided test files
2. **Verify CORS** is working correctly
3. **Test all CRUD operations** for both contacts and reviews
4. **Verify error handling** for various scenarios
5. **Test admin functionality** with proper authentication

## Troubleshooting

### Common Issues:
1. **CORS errors**: Check backend CORS configuration
2. **Connection refused**: Ensure backend is running on port 8081
3. **404 errors**: Verify endpoint URLs match backend routes
4. **Validation errors**: Check request body format matches DTOs

### Debug Steps:
1. Check browser developer tools for network errors
2. Verify backend logs for request processing
3. Use the test files to isolate specific endpoint issues
4. Check API base URL configuration in frontend components
