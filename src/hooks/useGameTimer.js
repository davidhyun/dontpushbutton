import { useState, useEffect } from 'react';

const useGameTimer = (gameStarted, gameOver) => {
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    let interval;
    if (gameStarted && !gameOver) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameStarted, gameOver]);

  const resetTimer = () => setTimer(0);

  return { timer, resetTimer };
};

export default useGameTimer;