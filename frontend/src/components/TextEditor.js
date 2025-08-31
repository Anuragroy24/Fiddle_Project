import React, { useCallback, useMemo } from 'react';
import './TextEditor.css';

const MAX_TEXT_LENGTH = 5000; // Reasonable limit for API processing

const TextEditor = ({ text, onChange, isLoading, error }) => {
  const characterCount = useMemo(() => text.length, [text]);
  const wordCount = useMemo(() => {
    return text.trim() ? text.trim().split(/\s+/).length : 0;
  }, [text]);
  
  const isTextTooLong = characterCount > MAX_TEXT_LENGTH;
  const isNearLimit = characterCount > MAX_TEXT_LENGTH * 0.8;

  const handleTextChange = useCallback((e) => {
    const newText = e.target.value;
    // Allow the change even if over limit, but warn user
    onChange(newText);
  }, [onChange]);

  const handleClearText = useCallback(() => {
    onChange('');
  }, [onChange]);

  const getTextAreaClassName = () => {
    let className = 'text-input';
    if (isLoading) className += ' loading';
    if (isTextTooLong) className += ' text-too-long';
    else if (isNearLimit) className += ' text-near-limit';
    return className;
  };

  return (
    <div className="text-editor">
      <div className="text-editor-header">
        <div className="header-top">
          <h2>Text Editor</h2>
          <div className="text-stats">
            <span className={`char-count ${isTextTooLong ? 'over-limit' : isNearLimit ? 'near-limit' : ''}`}>
              {characterCount}/{MAX_TEXT_LENGTH} characters
            </span>
            <span className="word-count">{wordCount} words</span>
          </div>
        </div>
        
        <div className="editor-controls">
          <button 
            className="clear-btn" 
            onClick={handleClearText}
            disabled={isLoading || !text.trim()}
            title="Clear all text"
          >
            Clear Text
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}
        {isTextTooLong && (
          <div className="warning-message">
            Text is too long. Please keep it under {MAX_TEXT_LENGTH} characters for optimal processing.
          </div>
        )}
        {text.trim() && text.length < 10 && (
          <div className="info-message">
            Tip: Longer text will give better tone adjustment results.
          </div>
        )}
      </div>
      
      <div className="text-editor-container">
        <textarea
          value={text}
          onChange={handleTextChange}
          placeholder="Enter your text here to adjust its tone... 

Try writing a few sentences for the best results. The tone picker will adjust the formality and friendliness of your text while preserving the original meaning."
          className={getTextAreaClassName()}
          disabled={isLoading}
          rows={20}
          spellCheck="true"
          autoComplete="off"
          autoCorrect="on"
        />
        {isLoading && (
          <div className="loading-overlay">
            <div className="loading-spinner"></div>
            <p>Adjusting tone...</p>
            <small>This may take a few seconds</small>
          </div>
        )}
      </div>
    </div>
  );
};

export default TextEditor;
