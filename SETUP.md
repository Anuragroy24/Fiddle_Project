# Tone Picker Text Tool - Setup Guide

## Quick Start for Development

### 1. Clone and Install
```bash
git clone <your-repo-url>
cd fiddleProject
npm run install:all
```

### 2. Set up Mistral AI API Key
1. Go to [Mistral AI Platform](https://docs.mistral.ai/api/) and create an account
2. Generate an API key (the small model is free to use)
3. Add your API key to backend environment:

```bash
cd backend
echo "MISTRAL_API_KEY=your_actual_api_key_here
PORT=5000
NODE_ENV=development" > .env
```

### 3. Run the Application
```bash
# From project root
npm run dev
```

This will start:
- Backend server on http://localhost:5000
- Frontend application on http://localhost:3000

## How to Use

### Basic Usage
1. **Enter Text**: Type or paste text in the left editor
2. **Adjust Tone**: Click any position on the 3x3 matrix:
   - **X-axis**: Casual ← → Formal
   - **Y-axis**: Professional ← → Friendly
3. **Navigate History**: Use Undo/Redo buttons
4. **Reset**: Click Reset to return to neutral tone

### Example Interactions

**Original Text:**
```
Hey, I need you to fix this bug ASAP. It's causing problems.
```

**Formal + Professional (bottom-right):**
```
I would appreciate it if you could address this software defect at your earliest convenience. It is currently impacting system functionality.
```

**Casual + Friendly (top-left):**
```
Hey there! Could you take a look at this little bug when you get a chance? It's being a bit troublesome! 😊
```

## Features Demonstrated

### 1. Tone Matrix (3x3 Grid)
- **9 different tone combinations**
- **Visual feedback** with selected state
- **Hover effects** for smooth interaction

### 2. Undo/Redo System
- **Complete history tracking** of all changes
- **Branching behavior** when making changes from past states
- **Persistent across tone adjustments and text edits**

### 3. Error Handling
- **Network errors** with retry suggestions
- **API rate limiting** with appropriate delays
- **Input validation** with helpful messages
- **Edge cases** like empty text, too long text, etc.

### 4. Performance Features
- **Request caching** to avoid duplicate API calls
- **Loading states** with progress indicators
- **Optimistic updates** for better UX

### 5. Persistence
- **localStorage** saves text content and settings
- **Restoration** on page reload
- **Cross-session** continuity

### 6. Responsive Design
- **Mobile-friendly** interface
- **Adaptive layouts** for different screen sizes
- **Touch-optimized** controls

## Testing the Application

### Test Cases to Try

1. **Basic Functionality**
   - Enter text and try different tone combinations
   - Verify tone changes are meaningful and contextually appropriate

2. **Undo/Redo**
   - Make several tone changes
   - Use undo to go back
   - Make a new change from a previous state
   - Try redo functionality

3. **Edge Cases**
   - Very short text (< 3 characters)
   - Very long text (> 5000 characters)
   - Empty text
   - Special characters and emojis

4. **Error Scenarios**
   - Disconnect internet and try tone adjustment
   - Try clicking same tone twice (should not make API call)
   - Test with invalid API key

5. **Persistence**
   - Enter text and adjust tone
   - Refresh the page
   - Verify content is restored

6. **Mobile Experience**
   - Test on different screen sizes
   - Verify touch interactions work smoothly
   - Check responsive layout

## Deployment Options

### Frontend (Vercel)
```bash
cd frontend
npm run build
# Deploy to Vercel
```

### Backend (Railway/Render/Vercel)
The backend is configured for serverless deployment with proper error handling and validation.

## Architecture Highlights

### State Management
- **Custom hook** `useUndoRedo` for history management
- **Immutable state updates** for reliable undo/redo
- **Optimistic UI updates** with error rollback

### API Integration
- **Secure backend proxy** keeps API keys hidden
- **Request deduplication** through caching
- **Graceful degradation** when backend is unavailable

### Error Boundary
- **React Error Boundary** catches unexpected errors
- **Development vs production** error display
- **Recovery options** for users

## Performance Optimizations

1. **Memoized calculations** (character/word count)
2. **Cached API responses** to avoid redundant calls
3. **Optimized re-renders** with `useCallback`
4. **Lazy loading** and code splitting ready
5. **Efficient state updates** with minimal re-renders

## Security Considerations

1. **API key protection** (server-side only)
2. **Input validation** on both frontend and backend
3. **CORS configuration** for secure cross-origin requests
4. **Rate limiting** awareness and handling
5. **XSS prevention** through proper escaping

---

🎉 **You now have a fully functional Tone Picker Text Tool!**

The application demonstrates modern React development practices, robust error handling, and smooth user experience with AI integration.
