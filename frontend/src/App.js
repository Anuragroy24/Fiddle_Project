import React, { useState, useEffect, useCallback } from 'react';
import TextEditor from './components/TextEditor';
import TonePicker from './components/TonePicker';
import ErrorBoundary from './components/ErrorBoundary';
import useUndoRedo from './hooks/useUndoRedo';
import { adjustTone, checkHealth } from './utils/api';
import { saveTextContent, loadTextContent, saveToneSettings, loadToneSettings, loadHistory } from './utils/storage';
import './App.css';

function App() {
  // Load initial state from localStorage or use defaults
  const initialText = loadTextContent();
  const initialToneSettings = loadToneSettings();
  
  const initialState = {
    text: initialText,
    formalityLevel: initialToneSettings.formalityLevel,
    friendlinessLevel: initialToneSettings.friendlinessLevel
  };

  // Undo/Redo state management
  const {
    currentState,
    pushState,
    undo,
    redo,
    canUndo,
    canRedo
  } = useUndoRedo(initialState);

  // Load history from localStorage if available
  useEffect(() => {
    const savedHistory = loadHistory();
    if (savedHistory && savedHistory.history && savedHistory.history.length > 0) {
      // If we have saved history, we could restore it, but for simplicity let's start fresh each time
      // This could be enhanced to restore the full history
    }
  }, []);

  // Local state for UI interactions
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [backendStatus, setBackendStatus] = useState('checking');

  // Check backend health on mount
  useEffect(() => {
    const checkBackendHealth = async () => {
      try {
        await checkHealth();
        setBackendStatus('connected');
      } catch (error) {
        setBackendStatus('disconnected');
        setError('Backend server is not available. Please make sure it\'s running.');
      }
    };

    checkBackendHealth();
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    saveTextContent(currentState.text);
    saveToneSettings(currentState.formalityLevel, currentState.friendlinessLevel);
  }, [currentState]);

  const handleTextChange = useCallback((newText) => {
    setError(null);
    pushState({
      ...currentState,
      text: newText
    });
  }, [currentState, pushState]);

  const handleToneChange = useCallback(async (formalityLevel, friendlinessLevel) => {
    // Enhanced validation and edge case handling
    if (isLoading) return;
    
    const textToProcess = currentState.text.trim();
    
    // Validate text content
    if (!textToProcess) {
      setError('Please enter some text before adjusting tone.');
      return;
    }

    if (textToProcess.length < 3) {
      setError('Text is too short. Please enter at least a few words for tone adjustment.');
      return;
    }

    if (textToProcess.length > 5000) {
      setError('Text is too long. Please keep it under 5000 characters for optimal processing.');
      return;
    }

    // Don't make API call if it's the same tone
    if (formalityLevel === currentState.formalityLevel && 
        friendlinessLevel === currentState.friendlinessLevel) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const adjustedText = await adjustTone(
        textToProcess, 
        formalityLevel, 
        friendlinessLevel
      );

      // Validate API response
      if (!adjustedText || typeof adjustedText !== 'string') {
        throw new Error('Invalid response from tone adjustment service');
      }

      // Check if the response is meaningfully different or if API just returned the same text
      if (adjustedText.trim() === textToProcess) {
        setError('No tone adjustment was needed for this text. Try different tone settings.');
        return;
      }

      // Push new state to history
      pushState({
        text: adjustedText,
        formalityLevel,
        friendlinessLevel
      });

    } catch (error) {
      // Enhanced error handling with user-friendly messages
      let errorMessage = 'Failed to adjust tone. ';
      
      if (error.message.includes('Network')) {
        errorMessage += 'Please check your internet connection and try again.';
      } else if (error.message.includes('rate limit')) {
        errorMessage += 'Service is busy. Please wait a moment before trying again.';
      } else if (error.message.includes('authentication')) {
        errorMessage += 'Service configuration issue. Please contact support.';
      } else {
        errorMessage += error.message || 'Please try again.';
      }
      
      setError(errorMessage);
      console.error('Failed to adjust tone:', error);
    } finally {
      setIsLoading(false);
    }
  }, [currentState, pushState, isLoading]);

  const handleReset = useCallback(() => {
    if (isLoading) return;
    
    pushState({
      ...currentState,
      formalityLevel: 0,
      friendlinessLevel: 0
    });
  }, [currentState, pushState, isLoading]);

  const handleUndo = useCallback(() => {
    if (canUndo && !isLoading) {
      setError(null);
      undo();
    }
  }, [canUndo, isLoading, undo]);

  const handleRedo = useCallback(() => {
    if (canRedo && !isLoading) {
      setError(null);
      redo();
    }
  }, [canRedo, isLoading, redo]);

  return (
    <ErrorBoundary>
      <div className="App">
        <header className="app-header">
          <h1>Tone Picker Text Tool</h1>
          <div className="backend-status">
            <span className={`status-indicator ${backendStatus}`}></span>
            <span className="status-text">
              {backendStatus === 'checking' && 'Connecting...'}
              {backendStatus === 'connected' && 'Connected'}
              {backendStatus === 'disconnected' && 'Disconnected'}
            </span>
          </div>
        </header>

        <main className="app-main">
          <TextEditor
            text={currentState.text}
            onChange={handleTextChange}
            isLoading={isLoading}
            error={error}
          />
          
          <TonePicker
            formalityLevel={currentState.formalityLevel}
            friendlinessLevel={currentState.friendlinessLevel}
            onToneChange={handleToneChange}
            onReset={handleReset}
            isLoading={isLoading}
            canUndo={canUndo}
            canRedo={canRedo}
            onUndo={handleUndo}
            onRedo={handleRedo}
          />
        </main>

        {!currentState.text.trim() && !isLoading && (
          <div className="empty-state">
            <p>Enter some text in the editor to start adjusting its tone!</p>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}

export default App;
