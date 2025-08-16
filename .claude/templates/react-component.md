# React Component Template

## Component Structure
```jsx
import React, { useState, useEffect } from 'react';
import './{{ComponentName}}.css';

function {{ComponentName}}() {
  // State management
  const [state, setState] = useState(initialValue);

  // Effects
  useEffect(() => {
    // Effect logic
  }, [dependencies]);

  // Event handlers
  const handleEvent = () => {
    // Handler logic
  };

  return (
    <div className="{{component-name}}">
      {/* Component JSX */}
    </div>
  );
}

export default {{ComponentName}};
```

## CSS Template
```css
.{{component-name}} {
  /* Component styles */
}
```

## Usage
- Replace `{{ComponentName}}` with your component name in PascalCase
- Replace `{{component-name}}` with your component name in kebab-case
- Add props interface if using TypeScript
- Follow the existing project patterns for styling