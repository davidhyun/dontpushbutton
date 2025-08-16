import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './{{featureName}}.css';

/**
 * {{featureDescription}}
 * Interactive button game feature component
 * 
 * @param {Object} props - Component props
 * @param {Function} props.onFeatureComplete - Callback when feature completes
 * @param {Function} props.onFeatureUpdate - Callback for feature updates
 * @param {Object} props.gameConfig - Game configuration
 * @param {boolean} props.isActive - Whether feature is active
 * @returns {JSX.Element} {{featureName}} component
 */
function {{featureName}}({ 
  onFeatureComplete, 
  onFeatureUpdate, 
  gameConfig = {}, 
  isActive = true 
}) {
  // Feature state
  const [featureStarted, setFeatureStarted] = useState(false);
  const [featureComplete, setFeatureComplete] = useState(false);
  const [timer, setTimer] = useState(0);
  const [{{featureMetric}}, set{{featureMetricCapitalized}}] = useState({{initialValue}});
  const [difficulty, setDifficulty] = useState(gameConfig.difficulty || 'medium');
  
  // Feature-specific state
  const [{{featureSpecificState}}, set{{featureSpecificStateCapitalized}}] = useState({{defaultFeatureValue}});
  const [{{animationState}}, set{{animationStateCapitalized}}] = useState({{defaultAnimationValue}});
  const [{{powerUpState}}, set{{powerUpStateCapitalized}}] = useState({{defaultPowerUpValue}});
  
  // UI state
  const [showInstructions, setShowInstructions] = useState(true);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [loading, setLoading] = useState(false);

  // Configuration based on difficulty
  const getFeatureConfig = useCallback(() => {
    const baseConfig = {
      {{baseConfigSettings}}
    };

    switch (difficulty) {
      case 'easy':
        return {
          ...baseConfig,
          {{easyConfigOverrides}}
        };
      case 'hard':
        return {
          ...baseConfig,
          {{hardConfigOverrides}}
        };
      default: // medium
        return baseConfig;
    }
  }, [difficulty]);

  // Timer effect
  useEffect(() => {
    let interval;
    if (featureStarted && !featureComplete && isActive) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [featureStarted, featureComplete, isActive]);

  // Feature progression effect
  useEffect(() => {
    if (featureStarted && !featureComplete) {
      const config = getFeatureConfig();
      
      // Check completion conditions
      {{completionCheckLogic}}
      
      // Update feature state
      {{featureProgressionLogic}}
      
      // Trigger updates
      if (onFeatureUpdate) {
        onFeatureUpdate({
          timer,
          {{featureMetric}},
          {{additionalMetrics}},
          progress: {{progressCalculation}}
        });
      }
    }
  }, [timer, {{featureMetric}}, featureStarted, featureComplete, onFeatureUpdate, getFeatureConfig]);

  // Start feature
  const startFeature = useCallback(() => {
    setFeatureStarted(true);
    setFeatureComplete(false);
    setTimer(0);
    set{{featureMetricCapitalized}}({{initialValue}});
    set{{featureSpecificStateCapitalized}}({{defaultFeatureValue}});
    set{{animationStateCapitalized}}({{defaultAnimationValue}});
    set{{powerUpStateCapitalized}}({{defaultPowerUpValue}});
    setMessage('');
    setMessageType('');
    setShowInstructions(false);
  }, []);

  // Complete feature
  const completeFeature = useCallback(async (completionData = {}) => {
    setFeatureComplete(true);
    setFeatureStarted(false);
    
    const featureResult = {
      feature_name: '{{featureName}}',
      timer,
      {{featureMetric}},
      {{additionalCompletionData}},
      difficulty,
      completed_at: new Date().toISOString(),
      ...completionData
    };

    try {
      setLoading(true);
      
      // Save feature result (if needed)
      {{saveFeatureResultLogic}}
      
      setMessage('{{completionMessage}}');
      setMessageType('success');
      
      // Notify parent
      if (onFeatureComplete) {
        onFeatureComplete(featureResult);
      }
      
    } catch (error) {
      console.error('{{featureName}} 완료 처리 오류:', error);
      setMessage('결과 저장에 실패했습니다.');
      setMessageType('failure');
    } finally {
      setLoading(false);
    }
  }, [timer, {{featureMetric}}, difficulty, onFeatureComplete]);

  // Main feature interaction
  const handle{{mainInteraction}} = useCallback(({{interactionParams}}) => {
    if (!featureStarted || featureComplete || !isActive || loading) return;

    {{mainInteractionLogic}}

    // Check for feature completion
    {{featureCompletionCheck}}

    // Check for special events
    {{specialEventChecks}}

    // Update animation state
    {{animationUpdateLogic}}

  }, [featureStarted, featureComplete, isActive, loading, {{dependencies}}]);

  // Secondary interactions
  const handle{{secondaryInteraction}} = useCallback(({{secondaryParams}}) => {
    if (!featureStarted || featureComplete || !isActive) return;

    {{secondaryInteractionLogic}}

  }, [featureStarted, featureComplete, isActive, {{secondaryDependencies}}]);

  // Power-up activation
  const activatePowerUp = useCallback((powerUpType) => {
    if (!featureStarted || featureComplete || !isActive) return;

    {{powerUpActivationLogic}}

    setMessage(`{{powerUpMessage}} ${powerUpType}!`);
    setMessageType('success');

  }, [featureStarted, featureComplete, isActive, {{powerUpDependencies}}]);

  // Reset feature
  const resetFeature = useCallback(() => {
    setFeatureStarted(false);
    setFeatureComplete(false);
    setTimer(0);
    set{{featureMetricCapitalized}}({{initialValue}});
    set{{featureSpecificStateCapitalized}}({{defaultFeatureValue}});
    set{{animationStateCapitalized}}({{defaultAnimationValue}});
    set{{powerUpStateCapitalized}}({{defaultPowerUpValue}});
    setMessage('');
    setMessageType('');
    setShowInstructions(true);
  }, []);

  // Format display values
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatMetric = (value) => {
    {{metricFormattingLogic}}
  };

  // Render loading state
  if (loading) {
    return (
      <div className="{{cssClassName}} loading">
        <div className="loading-spinner"></div>
        <p>처리 중...</p>
      </div>
    );
  }

  return (
    <div className={`{{cssClassName}} ${featureComplete ? 'completed' : ''} ${{{animationState}} ? 'animated' : ''}`}>
      
      {/* Instructions overlay */}
      {showInstructions && (
        <div className="instructions-overlay">
          <div className="instructions-content">
            <h3>{{featureTitle}}</h3>
            <div className="instructions-text">
              {{instructionsContent}}
            </div>
            <div className="difficulty-selector">
              <label>난이도 선택:</label>
              <select 
                value={difficulty} 
                onChange={(e) => setDifficulty(e.target.value)}
              >
                <option value="easy">쉬움</option>
                <option value="medium">보통</option>
                <option value="hard">어려움</option>
              </select>
            </div>
            <button onClick={startFeature} className="start-feature-button">
              시작하기
            </button>
          </div>
        </div>
      )}

      {/* Feature status display */}
      {featureStarted && !featureComplete && (
        <div className="feature-status">
          <div className="status-bar">
            <div className="timer">⏱️ {formatTime(timer)}</div>
            <div className="{{featureMetric}}-display">{{featureMetricIcon}} {formatMetric({{featureMetric}})}</div>
            <div className="difficulty-badge">🎯 {difficulty}</div>
          </div>
          
          {{additionalStatusDisplays}}
          
          {/* Progress bar */}
          <div className="progress-container">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${{{progressCalculation}}}%` }}
              ></div>
            </div>
            <span className="progress-text">{Math.round({{progressCalculation}})}%</span>
          </div>
        </div>
      )}

      {/* Main feature area */}
      {featureStarted && !featureComplete && (
        <div className="feature-main-area">
          {{mainFeatureAreaContent}}
          
          {/* Power-ups */}
          {{{powerUpState}} && (
            <div className="power-ups">
              {{powerUpContent}}
            </div>
          )}
          
          {/* Special effects */}
          {{{animationState}} && (
            <div className="special-effects">
              {{specialEffectsContent}}
            </div>
          )}
        </div>
      )}

      {/* Feature completion screen */}
      {featureComplete && (
        <div className="feature-complete-screen">
          <div className="complete-content">
            <h2>{{completionEmoji}}</h2>
            <h3>{{completionTitle}}</h3>
            <div className="final-stats">
              <p>⏱️ 소요 시간: {formatTime(timer)}</p>
              <p>{{featureMetricIcon}} {{featureMetricLabel}}: {formatMetric({{featureMetric}})}</p>
              {{additionalFinalStats}}
            </div>
            
            {message && (
              <div className={`message ${messageType}`}>
                {message}
              </div>
            )}
            
            <div className="completion-actions">
              <button onClick={resetFeature} className="retry-button">
                다시 시도
              </button>
              <button onClick={() => setShowInstructions(true)} className="settings-button">
                설정 변경
              </button>
            </div>
          </div>
        </div>
      )}
      
    </div>
  );
}

export default {{featureName}};

/*
Button Game Feature Template Usage:
1. Replace {{featureName}} with feature name (e.g., RapidClickChallenge, TimedButtonPress)
2. Replace {{featureDescription}} with feature description
3. Replace {{featureMetric}} with main metric (e.g., clickCount, pressureLevel)
4. Replace {{featureMetricCapitalized}} with capitalized version
5. Replace {{initialValue}} with initial metric value
6. Replace {{featureSpecificState}} with feature-specific state variable
7. Replace {{featureSpecificStateCapitalized}} with capitalized version
8. Replace {{defaultFeatureValue}} with default feature state value
9. Replace {{animationState}} with animation state variable
10. Replace {{animationStateCapitalized}} with capitalized version
11. Replace {{defaultAnimationValue}} with default animation value
12. Replace {{powerUpState}} with power-up state variable
13. Replace {{powerUpStateCapitalized}} with capitalized version
14. Replace {{defaultPowerUpValue}} with default power-up value
15. Replace {{baseConfigSettings}} with base configuration
16. Replace {{easyConfigOverrides}} with easy mode overrides
17. Replace {{hardConfigOverrides}} with hard mode overrides
18. Replace {{completionCheckLogic}} with completion check logic
19. Replace {{featureProgressionLogic}} with progression logic
20. Replace {{additionalMetrics}} with additional metric fields
21. Replace {{progressCalculation}} with progress calculation
22. Replace {{additionalCompletionData}} with extra completion data
23. Replace {{saveFeatureResultLogic}} with save logic
24. Replace {{completionMessage}} with completion message
25. Replace {{mainInteraction}} with main interaction name
26. Replace {{interactionParams}} with interaction parameters
27. Replace {{mainInteractionLogic}} with main interaction logic
28. Replace {{featureCompletionCheck}} with completion check
29. Replace {{specialEventChecks}} with special event checks
30. Replace {{animationUpdateLogic}} with animation update logic
31. Replace {{dependencies}} with callback dependencies
32. Replace {{secondaryInteraction}} with secondary interaction name
33. Replace {{secondaryParams}} with secondary parameters
34. Replace {{secondaryInteractionLogic}} with secondary logic
35. Replace {{secondaryDependencies}} with secondary dependencies
36. Replace {{powerUpActivationLogic}} with power-up logic
37. Replace {{powerUpMessage}} with power-up message
38. Replace {{powerUpDependencies}} with power-up dependencies
39. Replace {{metricFormattingLogic}} with metric formatting
40. Replace {{cssClassName}} with CSS class name
41. Replace {{featureTitle}} with feature title
42. Replace {{instructionsContent}} with instructions JSX
43. Replace {{featureMetricIcon}} with metric icon
44. Replace {{additionalStatusDisplays}} with extra status displays
45. Replace {{mainFeatureAreaContent}} with main area JSX
46. Replace {{powerUpContent}} with power-up JSX
47. Replace {{specialEffectsContent}} with effects JSX
48. Replace {{completionEmoji}} with completion emoji
49. Replace {{completionTitle}} with completion title
50. Replace {{featureMetricLabel}} with metric label
51. Replace {{additionalFinalStats}} with final stats

Example for Rapid Click Challenge:
- featureName: "RapidClickChallenge"
- featureMetric: "clickCount"
- mainInteraction: "ButtonClick"
- featureTitle: "빠른 클릭 챌린지"
- completionEmoji: "🎉"
- completionTitle: "챌린지 완료!"
*/