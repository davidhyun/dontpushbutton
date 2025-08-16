import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './{{componentName}}.css';

/**
 * {{componentDescription}}
 * 
 * @param {Object} props - Component props
 * @param {{propsList}} props.{{propName}} - {{propDescription}}
 * @returns {JSX.Element} {{componentName}} component
 */
function {{componentName}}({ {{propsList}} }) {
  // State management
  const [{{stateVariable}}, set{{stateVariableCapitalized}}] = useState({{defaultValue}});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Effect hooks
  useEffect(() => {
    // {{effectDescription}}
    {{effectLogic}}
  }, [{{dependencies}}]);

  // Event handlers
  const handle{{eventName}} = async ({{eventParams}}) => {
    try {
      setLoading(true);
      setError(null);
      
      {{eventLogic}}
      
      // API call if needed
      const response = await axios.{{httpMethod}}('{{apiEndpoint}}', {{requestData}});
      {{responseHandling}}
      
    } catch (error) {
      console.error('{{errorMessage}}:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Conditional rendering helpers
  if (loading) {
    return (
      <div className="loading">
        <p>로딩 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error">
        <p>오류: {error}</p>
        <button onClick={() => setError(null)}>다시 시도</button>
      </div>
    );
  }

  return (
    <div className="{{cssClassName}}">
      {{componentJSX}}
    </div>
  );
}

export default {{componentName}};

/*
Template Usage:
1. Replace {{componentName}} with your component name (e.g., GameButton, ScoreBoard)
2. Replace {{componentDescription}} with a brief description
3. Replace {{propsList}} with comma-separated props (e.g., score, onGameEnd, isActive)
4. Replace {{propName}} and {{propDescription}} for each prop in JSDoc
5. Replace {{stateVariable}} with your state variable name
6. Replace {{stateVariableCapitalized}} with capitalized version
7. Replace {{defaultValue}} with initial state value
8. Replace {{effectDescription}} and {{effectLogic}} with useEffect logic
9. Replace {{dependencies}} with dependency array for useEffect
10. Replace {{eventName}} with event handler name (e.g., ButtonClick, ScoreSubmit)
11. Replace {{eventParams}} with event parameters
12. Replace {{eventLogic}} with event handling logic
13. Replace {{httpMethod}} with HTTP method (get, post, put, delete)
14. Replace {{apiEndpoint}} with API URL
15. Replace {{requestData}} with request payload
16. Replace {{responseHandling}} with response processing logic
17. Replace {{errorMessage}} with error context message
18. Replace {{cssClassName}} with CSS class name
19. Replace {{componentJSX}} with component JSX content

Example:
- componentName: GameTimer
- stateVariable: seconds
- eventName: TimerTick
- apiEndpoint: http://localhost:8000/stats
*/