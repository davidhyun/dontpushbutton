# Python Flask API Endpoint Template

## Basic Endpoint Structure
```python
from flask import Flask, request, jsonify
from flask_cors import CORS

@app.route('/{{endpoint-name}}', methods=['{{HTTP_METHOD}}'])
def {{function_name}}():
    """
    {{Endpoint description}}
    
    Returns:
        JSON response with success/error status
    """
    try:
        # Get request data
        data = request.json if request.method in ['POST', 'PUT'] else request.args
        
        # Validation
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        # Business logic
        result = process_data(data)
        
        # Success response
        return jsonify({
            'success': True,
            'data': result,
            'message': 'Operation completed successfully'
        })
        
    except Exception as e:
        # Error handling
        return jsonify({
            'success': False,
            'error': str(e),
            'message': 'Operation failed'
        }), 500

def process_data(data):
    """Process the incoming data"""
    # Implementation logic
    return processed_result
```

## Usage Instructions
- Replace `{{endpoint-name}}` with your endpoint path
- Replace `{{HTTP_METHOD}}` with GET, POST, PUT, or DELETE
- Replace `{{function_name}}` with descriptive function name
- Add proper error handling and validation
- Follow REST API conventions