import React from 'react';

const GameButton = ({ onClick, disabled = false }) => {
  return (
    <div className="game-area">
      <button 
        onClick={onClick} 
        className="dont-push-button"
        disabled={disabled}
      >
        누르지 마세요
      </button>
    </div>
  );
};

export default GameButton;