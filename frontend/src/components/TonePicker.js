import React from 'react';
import './TonePicker.css';

const TonePicker = ({ 
  formalityLevel, 
  friendlinessLevel, 
  onToneChange, 
  onReset, 
  isLoading,
  canUndo,
  canRedo,
  onUndo,
  onRedo
}) => {
  const handleCellClick = (formality, friendliness) => {
    if (isLoading) return;
    onToneChange(formality, friendliness);
  };

  const renderCell = (formality, friendliness) => {
    const isSelected = formalityLevel === formality && friendlinessLevel === friendliness;
    const isDisabled = isLoading;
    
    return (
      <button
        key={`${formality}-${friendliness}`}
        className={`tone-cell ${isSelected ? 'selected' : ''} ${isDisabled ? 'disabled' : ''}`}
        onClick={() => handleCellClick(formality, friendliness)}
        disabled={isDisabled}
        aria-label={`Formality ${formality}, Friendliness ${friendliness}`}
      >
        <div className="cell-indicator"></div>
      </button>
    );
  };

  return (
    <div className="tone-picker">
      <div className="tone-picker-header">
        <h2>Tone Picker</h2>
        <div className="control-buttons">
          <button 
            className="control-btn undo-btn" 
            onClick={onUndo}
            disabled={!canUndo || isLoading}
            title="Undo"
          >
            ↶ Undo
          </button>
          <button 
            className="control-btn redo-btn" 
            onClick={onRedo}
            disabled={!canRedo || isLoading}
            title="Redo"
          >
            ↷ Redo
          </button>
          <button 
            className="control-btn reset-btn" 
            onClick={onReset}
            disabled={isLoading}
            title="Reset to neutral"
          >
            Reset
          </button>
        </div>
      </div>
      
      <div className="tone-matrix-container">
        <div className="axis-labels">
          <div className="y-axis">
            <span className="axis-label top">Friendly</span>
            <span className="axis-label middle">Neutral</span>
            <span className="axis-label bottom">Professional</span>
          </div>
        </div>
        
        <div className="tone-matrix">
          {/* Top row - Friendly */}
          <div className="matrix-row">
            {renderCell(-1, 1)}
            {renderCell(0, 1)}
            {renderCell(1, 1)}
          </div>
          
          {/* Middle row - Neutral */}
          <div className="matrix-row">
            {renderCell(-1, 0)}
            {renderCell(0, 0)}
            {renderCell(1, 0)}
          </div>
          
          {/* Bottom row - Professional */}
          <div className="matrix-row">
            {renderCell(-1, -1)}
            {renderCell(0, -1)}
            {renderCell(1, -1)}
          </div>
        </div>
        
        <div className="x-axis">
          <span className="axis-label left">Casual</span>
          <span className="axis-label center">Neutral</span>
          <span className="axis-label right">Formal</span>
        </div>
      </div>
      
      <div className="current-selection">
        <p>Current: 
          <span className="selection-detail">
            {formalityLevel === -1 ? 'Casual' : formalityLevel === 0 ? 'Neutral' : 'Formal'} · {' '}
            {friendlinessLevel === -1 ? 'Professional' : friendlinessLevel === 0 ? 'Neutral' : 'Friendly'}
          </span>
        </p>
      </div>
    </div>
  );
};

export default TonePicker;
