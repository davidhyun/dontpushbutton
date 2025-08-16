import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [timer, setTimer] = useState(0);
  const [clickCount, setClickCount] = useState(0);
  const [gameStarted, setGameStarted] = useState(true);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    let interval;
    if (gameStarted && !gameOver) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameStarted, gameOver]);

  const handleButtonClick = async () => {
    const newClickCount = clickCount + 1;
    setClickCount(newClickCount);
    
    setGameOver(true);
    setGameStarted(false);
    
    try {
      await axios.post('http://localhost:8000/score', {
        time: timer,
        clicks: newClickCount
      });
    } catch (error) {
      console.error('점수를 저장하는 중 오류가 발생했습니다:', error);
    }
  };

  const resetGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setTimer(0);
    setClickCount(0);
  };

  return (
    <div className="container">
      {gameStarted && !gameOver && (
        <div className="game-area">
          <button 
            onClick={handleButtonClick} 
            className="dont-push-button"
          >
            누르지 마세요
          </button>
        </div>
      )}

      {gameOver && (
        <div className="game-over-screen">
          <div className="game-over-content">
            <h2>😔</h2>
            <h3>결국 눌렀군요...</h3>
            <p>{timer}초 동안 버텼습니다</p>
            <button onClick={resetGame} className="reset-button">
              다시 도전
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;