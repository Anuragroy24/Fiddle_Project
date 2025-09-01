# Tone Picker Text Tool

A web application that allows users to adjust the tone of text using an intuitive 3x3 matrix interface. Built with React frontend and Node.js backend, integrated with Mistral AI for intelligent tone adjustment.

## Features

### Core Functionality
- **Text Editor**: Clean, responsive text input area with real-time editing
- **3x3 Tone Matrix**: Interactive picker to adjust formality (Casual ↔ Formal) and friendliness (Professional ↔ Friendly)
- **Undo/Redo**: Full history tracking with ability to navigate through tone changes
- **Reset Button**: Quick return to neutral tone settings
- **Real-time Feedback**: Loading states and visual indicators during API processing

### Technical Features
- **API Integration**: Secure backend integration with Mistral AI's small model
- **Request Caching**: Intelligent caching to avoid redundant API calls
- **Error Handling**: Comprehensive error management for network issues, API failures, and edge cases
- **Local Persistence**: Automatic saving of text content and settings to localStorage
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

## Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Mistral AI API key ([Get one here](https://docs.mistral.ai/api/))

### Installation

1. **Clone and install dependencies:**
   \`\`\`bash
   git clone <repository-url>
   cd fiddleProject
   npm run install:all
   \`\`\`

2. **Set up environment variables:**
   \`\`\`bash
   cd backend
   cp .env.example .env
   \`\`\`
   
   Edit \`backend/.env\` and add your Mistral AI API key:
   \`\`\`
   MISTRAL_API_KEY=your_actual_api_key_here
   PORT=5000
   NODE_ENV=development
   \`\`\`

3. **Start the application:**
   \`\`\`bash
   # From project root
   npm run dev
   \`\`\`
   
   This will start both:
   - Backend server on http://localhost:5000
   - Frontend application on http://localhost:3000

## Usage

1. **Enter Text**: Type or paste your text in the left text editor
2. **Adjust Tone**: Click any cell in the 3x3 matrix to adjust tone:
   - **X-axis**: Casual ← Neutral → Formal
   - **Y-axis**: Professional ← Neutral → Friendly
3. **Navigate History**: Use Undo/Redo buttons to navigate through changes
4. **Reset**: Click Reset to return to neutral tone (center of matrix)

### Tone Matrix Guide

| Position | Formality | Friendliness | Example Use Case |
|----------|-----------|--------------|------------------|
| Top-Left | Casual | Friendly | Social media posts, friendly emails |
| Top-Center | Neutral | Friendly | Customer service, approachable content |
| Top-Right | Formal | Friendly | Professional but warm communications |
| Middle-Left | Casual | Neutral | Blog posts, informal documentation |
| Center | Neutral | Neutral | Standard business communication |
| Middle-Right | Formal | Neutral | Official documents, reports |
| Bottom-Left | Casual | Professional | Technical discussions with peers |
| Bottom-Center | Neutral | Professional | Standard professional emails |
| Bottom-Right | Formal | Professional | Legal documents, executive communications |

## Technical Architecture

### Frontend (React)
- **State Management**: Custom \`useUndoRedo\` hook for history tracking
- **Component Architecture**: Modular design with \`TextEditor\` and \`TonePicker\` components
- **API Layer**: Axios-based API client with interceptors for error handling
- **Persistence**: localStorage integration for data persistence across sessions
- **Responsive Design**: CSS Grid and Flexbox for adaptive layouts

### Backend (Node.js/Express)
- **API Security**: Environment-based API key management (keys never exposed to frontend)
- **Caching System**: In-memory cache to reduce API calls and improve performance
- **Error Handling**: Comprehensive error handling for various failure scenarios
- **CORS Support**: Configured for cross-origin requests from frontend

### State Management Strategy

The application uses a sophisticated undo/redo system:

1. **History Tracking**: Each action (text change, tone adjustment) creates a new state in history
2. **Immutable Updates**: State is never mutated directly, new states are pushed to history
3. **Navigation**: Users can navigate forward/backward through history
4. **Branching**: New actions from a previous state create a new branch (removes future history)
5. **Persistence**: Current state is saved to localStorage for session recovery

### Error Handling Approach

1. **Network Errors**: Graceful handling of connection issues with user-friendly messages
2. **API Errors**: Specific error messages for different API failure types:
   - Authentication errors (401)
   - Rate limiting (429)
   - Server errors (500)
   - Invalid requests (400)
3. **Input Validation**: Frontend and backend validation for text input
4. **Loading States**: Clear visual feedback during API processing
5. **Fallback Behavior**: Application remains functional even when backend is unavailable


### Available Scripts

From project root:
- \`npm run dev\` - Start both frontend and backend in development mode
- \`npm run start:backend\` - Start only backend server
- \`npm run start:frontend\` - Start only frontend application
- \`npm run build:frontend\` - Build frontend for production
- \`npm run install:all\` - Install dependencies for all projects

### Environment Variables

Backend (\`backend/.env\`):
- \`MISTRAL_API_KEY\` - Your Mistral AI API key (required)
- \`PORT\` - Server port (default: 5000)
- \`NODE_ENV\` - Environment mode (development/production)

Frontend automatically detects the backend URL:
- Development: http://localhost:5000/api
- Production: Can be configured with \`REACT_APP_API_URL\`

## API Endpoints

### POST /api/adjust-tone
Adjust the tone of provided text.

**Request:**
\`\`\`json
{
  "text": "Your text here",
  "formalityLevel": 0,     // -1 (casual) to 1 (formal)
  "friendlinessLevel": 0   // -1 (professional) to 1 (friendly)
}
\`\`\`

**Response:**
\`\`\`json
{
  "adjustedText": "Text with adjusted tone"
}
\`\`\`

### GET /api/health
Check backend server health.

**Response:**
\`\`\`json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
\`\`\`


## Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set build command to \`npm run build:frontend\`
3. Set build directory to \`frontend/build\`
4. Configure environment variable \`REACT_APP_API_URL\` to point to your backend

### Backend (Railway/Render)
1. Deploy backend directory to your preferred hosting service
2. Set environment variables:
   - \`MISTRAL_API_KEY\`: Your API key
   - \`NODE_ENV\`: production
   - \`PORT\`: (usually auto-configured)


## Performance Considerations

- **Request Caching**: Duplicate requests with same parameters are served from cache
- **Debounced Input**: Text changes don't immediately trigger API calls
- **Optimistic Updates**: UI updates immediately with loading states
- **Error Recovery**: Failed requests don't break the application state


