import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './{{componentName}}.css';

/**
 * {{gameComponentDescription}}
 * Game component for the "Don't Push Button" game
 * 
 * @param {Object} props - Component props
 * @param {Function} props.onGameEnd - Callback when game ends
 * @param {Function} props.onScoreUpdate - Callback when score updates
 * @param {boolean} props.isActive - Whether game is currently active
 * @returns {JSX.Element} {{componentName}} component
 */
function {{componentName}}({ onGameEnd, onScoreUpdate, isActive = true }) {
  // Game state
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [timer, setTimer] = useState(0);
  const [{{gameStateVariable}}, set{{gameStateVariableCapitalized}}] = useState({{gameDefaultValue}});
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success', 'warning', 'failure'

  // Timer effect
  useEffect(() => {
    let interval;
    if (gameStarted && !gameOver && isActive) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameStarted, gameOver, isActive]);

  // Game mechanics
  const startGame = useCallback(() => {
    setGameStarted(true);
    setGameOver(false);
    setTimer(0);
    set{{gameStateVariableCapitalized}}({{gameDefaultValue}});
    setMessage('');
    setMessageType('');
  }, []);

  const endGame = useCallback(async (gameData = {}) => {
    setGameOver(true);
    setGameStarted(false);
    
    const finalScore = {
      time: timer,
      {{additionalScoreFields}},
      ...gameData
    };

    try {
      setLoading(true);
      
      // Save score to backend
      const response = await axios.post('http://localhost:8000/score', finalScore);
      
      setMessage('{{successMessage}}');
      setMessageType('success');
      
      // Notify parent component
      if (onGameEnd) {
        onGameEnd(finalScore, response.data);
      }
      
    } catch (error) {
      console.error('게임 종료 처리 중 오류:', error);
      setMessage('점수 저장에 실패했습니다.');
      setMessageType('failure');
    } finally {
      setLoading(false);
    }
  }, [timer, {{gameStateVariable}}, onGameEnd]);

  // Game event handlers
  const handle{{gameEvent}} = useCallback(({{eventParameters}}) => {
    if (!gameStarted || gameOver || !isActive) return;

    {{gameEventLogic}}

    // Update score callback
    if (onScoreUpdate) {
      onScoreUpdate({
        time: timer,
        {{currentScoreFields}}
      });
    }

    {{endGameCondition}}
  }, [gameStarted, gameOver, isActive, timer, {{dependencies}}]);

  // Format time display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Render loading state
  if (loading) {
    return (
      <div className="{{cssClassName}} loading">
        <p>처리 중...</p>
      </div>
    );
  }

  return (
    <div className={`{{cssClassName}} ${gameOver ? 'game-over' : ''}`}>
      {/* Game status display */}
      {gameStarted && !gameOver && (
        <div className="game-status">
          <div className="timer">시간: {formatTime(timer)}</div>
          <div className="{{gameStateDisplay}}">{{gameStateVariable}}: {{{gameStateVariable}}}</div>
        </div>
      )}

      {/* Pre-game screen */}
      {!gameStarted && !gameOver && (
        <div className="start-screen">
          <h3>{{gameTitle}}</h3>
          <p className="instructions">{{gameInstructions}}</p>
          <button onClick={startGame} className="start-button">
            게임 시작
          </button>
        </div>
      )}

      {/* Active game area */}
      {gameStarted && !gameOver && (
        <div className="game-area">
          {{gameAreaContent}}
        </div>
      )}

      {/* Game over screen */}
      {gameOver && (
        <div className="game-over-screen">
          <div className="game-over-content">
            <h2>{{gameOverEmoji}}</h2>
            <h3>{{gameOverTitle}}</h3>
            <p>{formatTime(timer)} 동안 플레이했습니다</p>
            <p>{{gameOverStats}}</p>
            
            {message && (
              <div className={`message ${messageType}`}>
                {message}
              </div>
            )}
            
            <button onClick={startGame} className="reset-button">
              다시 도전
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default {{componentName}};

/*
Game Component Template Usage:
1. Replace {{componentName}} with your game component name (e.g., ButtonGame, ClickChallenge)
2. Replace {{gameComponentDescription}} with component description
3. Replace {{gameStateVariable}} with main game state (e.g., clickCount, lives, score)
4. Replace {{gameStateVariableCapitalized}} with capitalized version
5. Replace {{gameDefaultValue}} with initial game state value
6. Replace {{gameEvent}} with main game event (e.g., ButtonClick, Move, Action)
7. Replace {{eventParameters}} with event handler parameters
8. Replace {{gameEventLogic}} with the core game logic
9. Replace {{endGameCondition}} with condition to end game
10. Replace {{additionalScoreFields}} with extra score data
11. Replace {{currentScoreFields}} with current score state
12. Replace {{successMessage}} with success message
13. Replace {{cssClassName}} with main CSS class
14. Replace {{gameStateDisplay}} with CSS class for state display
15. Replace {{gameTitle}} with game title
16. Replace {{gameInstructions}} with game instructions
17. Replace {{gameAreaContent}} with main game UI JSX
18. Replace {{gameOverEmoji}} with game over emoji
19. Replace {{gameOverTitle}} with game over message
20. Replace {{gameOverStats}} with final statistics display
21. Replace {{dependencies}} with useCallback dependencies

Example for Button Game:
- componentName: DontPushButtonGame
- gameStateVariable: clickCount
- gameEvent: ButtonClick
- gameTitle: "절대 누르면 안 되는 버튼"
- gameInstructions: "버튼을 누르지 마세요!"
- gameOverEmoji: "😔"
- gameOverTitle: "결국 눌렀군요..."
*/