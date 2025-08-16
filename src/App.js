import React, { useState } from 'react';
import GameButton from './components/GameButton';
import GameOverScreen from './components/GameOverScreen';
import useGameTimer from './hooks/useGameTimer';
import { gameAPI } from './services/api';
import './App.css';

function App() {
  const [clickCount, setClickCount] = useState(0);
  const [gameStarted, setGameStarted] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  
  const { timer, resetTimer } = useGameTimer(gameStarted, gameOver);

  const handleButtonClick = async () => {
    const newClickCount = clickCount + 1;
    setClickCount(newClickCount);
    
    setGameOver(true);
    setGameStarted(false);
    
    try {
      await gameAPI.saveScore({
        time: timer,
        clicks: newClickCount
      });
    } catch (error) {
      // API 에러 처리는 서비스 레이어에서 이미 처리됨
    }
  };

  const resetGame = () => {
    setGameStarted(true);
    setGameOver(false);
    resetTimer();
    setClickCount(0);
  };

  return (
    <div className="container">
      {gameStarted && !gameOver && (
        <GameButton onClick={handleButtonClick} />
      )}

      {gameOver && (
        <GameOverScreen timer={timer} onReset={resetGame} />
      )}
    </div>
  );
}

export default App;