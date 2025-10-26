# Vite + React Quick Start Guide

## ✅ Conversion Complete!

Your project has been successfully converted from Webpack to Vite + React.

## 🚀 How to Run

### 1. Start the Backend (Spring Boot)
Make sure your Spring Boot backend is running on port **8082**
```bash
# Run your Spring Boot application
# Backend should be at: http://localhost:8082
```

### 2. Start the Frontend (Vite)
```bash
npm run dev
```

The Vite dev server will start at: **http://localhost:3000**

### 3. Access the Application

- **Home**: http://localhost:3000
- **Contact Page**: http://localhost:3000/contact
- **Reviews Page**: http://localhost:3000/reviews

## 📁 Project Structure

```
topcinnamon-frontend/
├── index.html          # Main HTML entry point
├── vite.config.js      # Vite configuration
├── package.json        # Dependencies
├── src/
│   ├── index.js       # React entry point
│   ├── components/    # React components
│   └── utils/         # Utility functions
└── public/            # Static assets
```

## 🔧 What Changed

### Removed:
- ❌ `webpack.config.js`
- ❌ Webpack-related dependencies
- ❌ Old public/index.html, contact.html, reviews.html

### Added:
- ✅ `vite.config.js` - Vite configuration
- ✅ `index.html` in root - Vite entry point
- ✅ Proxy configuration for API calls

### Updated:
- ✅ `package.json` - Uses Vite instead of Webpack
- ✅ `src/components/ContactUs.jsx` - API calls use relative paths
- ✅ `src/components/ProductReview.jsx` - API calls use relative paths
- ✅ API base URLs changed from `http://localhost:8082/api` to `/api`

## 🌐 API Proxy Configuration

All API requests from the frontend are automatically proxied to the backend:

**Frontend (Port 3000)** → **Backend (Port 8082)**

```
/api/contact → http://localhost:8082/api/contact
/api/reviews → http://localhost:8082/api/reviews
```

## 📝 Available Scripts

```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🐛 Troubleshooting

### If you see "Whitelabel Error Page":
- Make sure your Spring Boot backend is running on port 8082
- Check that the backend has the API endpoints configured
- Verify CORS is enabled in your Spring Boot configuration

### If you see "Cannot GET /route":
- Make sure the dev server is running: `npm run dev`
- Check that you're accessing the correct URL
- Restart the dev server if you changed configuration

### If API calls fail:
1. Check browser console for errors
2. Verify backend is running: `curl http://localhost:8082/api/contact`
3. Check network tab to see if requests are being made

## ✅ Testing Checklist

- [ ] Backend is running on port 8082
- [ ] Frontend runs with `npm run dev`
- [ ] Can access http://localhost:3000
- [ ] Contact page loads: http://localhost:3000/contact
- [ ] Reviews page loads: http://localhost:3000/reviews
- [ ] API calls work (check browser console)

## 🎯 Next Steps

1. **Start backend**: Run your Spring Boot application
2. **Start frontend**: Run `npm run dev`
3. **Test the app**: Navigate to http://localhost:3000/contact
4. **Submit your work**: Make sure everything works before submission!

## 📞 Need Help?

Check the browser console for any errors. Common issues:
- Backend not running → Start Spring Boot on port 8082
- CORS errors → Backend needs to allow requests from port 3000
- 404 errors → Check the route exists in your backend

Good luck with your submission! 🚀

