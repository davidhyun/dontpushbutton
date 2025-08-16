import React from 'react';

const GameOverScreen = ({ timer, onReset }) => {
  return (
    <div className="game-over-screen">
      <div className="game-over-content">
        <h2>😔</h2>
        <h3>결국 눌렀군요...</h3>
        <p>{timer}초 동안 버텼습니다</p>
        <button onClick={onReset} className="reset-button">
          다시 도전
        </button>
      </div>
    </div>
  );
};

export default GameOverScreen;