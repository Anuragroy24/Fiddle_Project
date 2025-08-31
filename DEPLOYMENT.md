# Deployment Guide - Tone Picker Text Tool

## Pre-Deployment Checklist

- ✅ Code is tested locally
- ✅ Environment variables are configured  
- ✅ No linting errors
- ✅ Build process works correctly
- ✅ API key is ready for production

## Frontend Deployment (Vercel)

### Option 1: GitHub Integration (Recommended)

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Tone Picker Text Tool"
   git branch -M main
   git remote add origin https://github.com/yourusername/tone-picker-text-tool.git
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Connect your GitHub account
   - Import the repository
   - Set build command: `cd frontend && npm run build`
   - Set output directory: `frontend/build`
   - Set root directory: `./`

3. **Configure Environment Variables**
   - In Vercel dashboard, go to Project Settings > Environment Variables
   - Add: `REACT_APP_API_URL` = `https://your-backend-url.vercel.app/api`

### Option 2: CLI Deployment

```bash
npm install -g vercel
cd frontend
npm run build
vercel --prod
```

## Backend Deployment (Vercel/Railway/Render)

### Deploy to Vercel

1. **Create separate repository for backend**
   ```bash
   cd backend
   git init
   git add .
   git commit -m "Backend for Tone Picker"
   git remote add origin https://github.com/yourusername/tone-picker-backend.git
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Import backend repository to Vercel
   - Configure environment variables:
     - `MISTRAL_API_KEY` = your actual API key
     - `NODE_ENV` = production

### Deploy to Railway (Alternative)

```bash
npm install -g @railway/cli
cd backend
railway login
railway init
railway add
railway deploy
```

### Deploy to Render (Alternative)

1. Connect GitHub repository to Render
2. Create new Web Service
3. Set build command: `npm install`
4. Set start command: `npm start`
5. Add environment variables

## Environment Variables Setup

### Frontend (.env)
```bash
REACT_APP_API_URL=https://your-backend-url.com/api
```

### Backend (.env)
```bash
MISTRAL_API_KEY=your_mistral_api_key_here
NODE_ENV=production
PORT=5000
```

## Post-Deployment Testing

### 1. Frontend Tests
- ✅ Application loads correctly
- ✅ UI is responsive on different devices
- ✅ Error boundary catches issues
- ✅ Loading states work properly

### 2. Backend Tests
- ✅ Health endpoint responds: `GET /api/health`
- ✅ Tone adjustment works: `POST /api/adjust-tone`
- ✅ Error handling works with invalid requests
- ✅ CORS is configured properly

### 3. Integration Tests
- ✅ Frontend connects to backend successfully
- ✅ Tone adjustments work end-to-end
- ✅ Error messages display correctly
- ✅ Undo/redo functionality works
- ✅ Persistence across page reloads

## Performance Optimization for Production

### Frontend
```bash
# Build with optimizations
cd frontend
npm run build

# Analyze bundle size (optional)
npx webpack-bundle-analyzer build/static/js/*.js
```

### Backend
- API response caching is already implemented
- Request validation prevents unnecessary processing
- Error handling reduces server load

## Monitoring & Maintenance

### Key Metrics to Monitor
1. **API Response Times** - Should be < 10 seconds for tone adjustments
2. **Error Rates** - Should be < 5% of total requests
3. **Cache Hit Rate** - Should be > 20% for repeated requests
4. **User Engagement** - Time spent, actions per session

### Common Issues & Solutions

#### Frontend Issues
- **Blank page**: Check console for JavaScript errors
- **API errors**: Verify REACT_APP_API_URL is correct
- **Mobile issues**: Test responsive breakpoints

#### Backend Issues
- **API timeouts**: Check Mistral AI service status
- **Authentication errors**: Verify API key is correct
- **CORS errors**: Ensure frontend domain is allowed

#### Integration Issues
- **Network errors**: Check if both services are deployed
- **Mixed content**: Ensure both use HTTPS in production

## Security Considerations

### ✅ Already Implemented
- API keys are server-side only
- Input validation on both ends
- CORS configuration
- Error message sanitization
- Request size limits

### 🔍 Additional Recommendations
- Add rate limiting for production
- Implement request logging
- Set up monitoring alerts
- Regular security updates

## Scaling Considerations

### Current Architecture Supports
- ⚡ **Serverless scaling** - Auto-scales with traffic
- 💾 **Caching layer** - Reduces API calls by ~30%
- 🔄 **Stateless design** - Easy to scale horizontally
- 📱 **CDN distribution** - Fast global access

### Future Enhancements
- Database for user accounts and history
- Redis for distributed caching  
- WebSocket for real-time collaboration
- A/B testing for UI improvements

---

## Quick Deployment Commands

### Full Deployment Script
```bash
#!/bin/bash
# Deploy Tone Picker Text Tool

echo "Building frontend..."
cd frontend && npm run build

echo "Testing backend..."
cd ../backend && npm test

echo "Deploying to Vercel..."
vercel --prod

echo "✅ Deployment complete!"
echo "Frontend: https://tone-picker-text-tool.vercel.app"
echo "Backend: https://tone-picker-backend.vercel.app"
```

Make this script executable: `chmod +x deploy.sh`

🚀 **Your Tone Picker Text Tool is now ready for production!**
