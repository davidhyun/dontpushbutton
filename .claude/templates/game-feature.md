# Game Feature Template

## Feature Planning
```markdown
# {{Feature Name}}

## Description
Brief description of what this feature does

## Requirements
- [ ] Requirement 1
- [ ] Requirement 2
- [ ] Requirement 3

## Implementation Plan
1. Frontend changes
2. Backend changes
3. Testing strategy

## Files to Modify
- `src/App.js` - Main game logic
- `src/App.css` - Styling updates
- `server.py` - Backend endpoints
- `README.md` - Documentation
```

## React Implementation Pattern
```jsx
// State for new feature
const [{{featureName}}, set{{FeatureName}}] = useState(initialValue);

// Event handler
const handle{{FeatureName}} = (event) => {
  // Feature logic
  set{{FeatureName}}(newValue);
  
  // API call if needed
  try {
    await axios.post('/api/{{endpoint}}', data);
  } catch (error) {
    console.error('Feature error:', error);
  }
};

// UI Component
<div className="{{feature-name}}">
  <button onClick={handle{{FeatureName}}}>
    {{Button Text}}
  </button>
</div>
```

## Python Backend Pattern
```python
@app.route('/api/{{endpoint}}', methods=['POST'])
def {{feature_function}}():
    """Handle {{feature name}} functionality"""
    data = request.json
    
    # Validate input
    if not validate_{{feature}}_data(data):
        return jsonify({'error': 'Invalid data'}), 400
    
    # Process feature
    result = process_{{feature}}(data)
    
    return jsonify({
        'success': True,
        'data': result
    })
```

## Usage
- Replace `{{Feature Name}}` with your feature name
- Replace `{{featureName}}` with camelCase version
- Replace `{{FeatureName}}` with PascalCase version
- Replace `{{feature-name}}` with kebab-case version
- Replace `{{endpoint}}` with API endpoint path