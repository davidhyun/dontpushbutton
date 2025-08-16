from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os
from datetime import datetime
from typing import Dict, List, Optional, Any

# Import your data models/schemas here
# from models import {{ModelName}}
# from schemas import {{SchemaName}}

app = Flask(__name__)
CORS(app)

# Configuration
{{DATA_FILE}} = '{{dataFileName}}.json'
{{CONFIG_CONSTANTS}}

def load_{{dataType}}() -> List[Dict[str, Any]]:
    """
    Load {{dataType}} from JSON file
    
    Returns:
        List[Dict]: List of {{dataType}} records
    """
    if os.path.exists({{DATA_FILE}}):
        try:
            with open({{DATA_FILE}}, 'r', encoding='utf-8') as f:
                return json.load(f)
        except (json.JSONDecodeError, FileNotFoundError) as e:
            print(f"{{dataType}} 파일 로드 오류: {e}")
            return []
    return []

def save_{{dataType}}({{dataType}}: List[Dict[str, Any]]) -> bool:
    """
    Save {{dataType}} to JSON file
    
    Args:
        {{dataType}}: List of {{dataType}} records to save
        
    Returns:
        bool: True if successful, False otherwise
    """
    try:
        with open({{DATA_FILE}}, 'w', encoding='utf-8') as f:
            json.dump({{dataType}}, f, ensure_ascii=False, indent=2)
        return True
    except Exception as e:
        print(f"{{dataType}} 저장 오류: {e}")
        return False

def validate_{{entityName}}_data(data: Dict[str, Any]) -> tuple[bool, str]:
    """
    Validate {{entityName}} data
    
    Args:
        data: Data to validate
        
    Returns:
        tuple: (is_valid, error_message)
    """
    required_fields = [{{requiredFields}}]
    
    for field in required_fields:
        if field not in data:
            return False, f"필수 필드가 누락되었습니다: {field}"
        
        if not data[field] and field != {{optionalZeroField}}:
            return False, f"필드 값이 비어있습니다: {field}"
    
    # Additional validation logic
    {{additionalValidation}}
    
    return True, ""

@app.route('/{{endpoint}}', methods=['GET'])
def get_{{functionName}}():
    """
    {{getDescription}}
    
    Query Parameters:
        {{queryParameters}}
    
    Returns:
        JSON: {{getReturnDescription}}
    """
    try:
        {{dataVariable}} = load_{{dataType}}()
        
        # Query parameter handling
        {{queryParamLogic}}
        
        # Data processing
        {{dataProcessingLogic}}
        
        return jsonify({{returnData}}), 200
        
    except Exception as e:
        print(f"{{endpoint}} GET 오류: {e}")
        return jsonify({
            'error': '데이터를 가져오는 중 오류가 발생했습니다.',
            'message': str(e)
        }), 500

@app.route('/{{endpoint}}', methods=['POST'])
def create_{{functionName}}():
    """
    {{postDescription}}
    
    Request Body:
        {{requestBodySchema}}
    
    Returns:
        JSON: {{postReturnDescription}}
    """
    try:
        # Get request data
        data = request.get_json()
        
        if not data:
            return jsonify({
                'error': '요청 데이터가 필요합니다.'
            }), 400
        
        # Validate data
        is_valid, error_message = validate_{{entityName}}_data(data)
        if not is_valid:
            return jsonify({
                'error': '유효하지 않은 데이터입니다.',
                'message': error_message
            }), 400
        
        # Load existing data
        {{dataVariable}} = load_{{dataType}}()
        
        # Create new record
        new_{{entityName}} = {
            {{newRecordFields}},
            'timestamp': datetime.now().isoformat(),
            'id': {{idGenerationLogic}}
        }
        
        # Additional processing
        {{additionalProcessing}}
        
        # Add to collection
        {{dataVariable}}.append(new_{{entityName}})
        
        # Save data
        if not save_{{dataType}}({{dataVariable}}):
            return jsonify({
                'error': '데이터 저장에 실패했습니다.'
            }), 500
        
        return jsonify({
            'message': '{{successMessage}}',
            '{{entityName}}': new_{{entityName}},
            {{additionalResponseData}}
        }), 201
        
    except Exception as e:
        print(f"{{endpoint}} POST 오류: {e}")
        return jsonify({
            'error': '{{entityName}} 생성 중 오류가 발생했습니다.',
            'message': str(e)
        }), 500

@app.route('/{{endpoint}}/<{{idType}}:{{idParam}}>', methods=['GET'])
def get_{{functionName}}_by_id({{idParam}}: {{idType}}):
    """
    {{getByIdDescription}}
    
    Args:
        {{idParam}}: {{idDescription}}
    
    Returns:
        JSON: {{getByIdReturnDescription}}
    """
    try:
        {{dataVariable}} = load_{{dataType}}()
        
        # Find record by ID
        {{entityName}} = next((item for item in {{dataVariable}} if item.get('{{idField}}') == {{idParam}}), None)
        
        if not {{entityName}}:
            return jsonify({
                'error': '{{entityName}}을(를) 찾을 수 없습니다.',
                'id': {{idParam}}
            }), 404
        
        return jsonify({{entityName}}), 200
        
    except Exception as e:
        print(f"{{endpoint}}/{{{idParam}}} GET 오류: {e}")
        return jsonify({
            'error': '데이터를 가져오는 중 오류가 발생했습니다.',
            'message': str(e)
        }), 500

@app.route('/{{endpoint}}/<{{idType}}:{{idParam}}>', methods=['PUT'])
def update_{{functionName}}({{idParam}}: {{idType}}):
    """
    {{updateDescription}}
    
    Args:
        {{idParam}}: {{idDescription}}
    
    Request Body:
        {{updateRequestBodySchema}}
    
    Returns:
        JSON: {{updateReturnDescription}}
    """
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({
                'error': '업데이트할 데이터가 필요합니다.'
            }), 400
        
        {{dataVariable}} = load_{{dataType}}()
        
        # Find and update record
        for i, item in enumerate({{dataVariable}}):
            if item.get('{{idField}}') == {{idParam}}:
                # Update fields
                {{updateLogic}}
                item['updated_at'] = datetime.now().isoformat()
                
                # Save data
                if not save_{{dataType}}({{dataVariable}}):
                    return jsonify({
                        'error': '데이터 저장에 실패했습니다.'
                    }), 500
                
                return jsonify({
                    'message': '{{updateSuccessMessage}}',
                    '{{entityName}}': item
                }), 200
        
        return jsonify({
            'error': '{{entityName}}을(를) 찾을 수 없습니다.',
            'id': {{idParam}}
        }), 404
        
    except Exception as e:
        print(f"{{endpoint}}/{{{idParam}}} PUT 오류: {e}")
        return jsonify({
            'error': '{{entityName}} 업데이트 중 오류가 발생했습니다.',
            'message': str(e)
        }), 500

@app.route('/{{endpoint}}/<{{idType}}:{{idParam}}>', methods=['DELETE'])
def delete_{{functionName}}({{idParam}}: {{idType}}):
    """
    {{deleteDescription}}
    
    Args:
        {{idParam}}: {{idDescription}}
    
    Returns:
        JSON: {{deleteReturnDescription}}
    """
    try:
        {{dataVariable}} = load_{{dataType}}()
        
        # Find and remove record
        for i, item in enumerate({{dataVariable}}):
            if item.get('{{idField}}') == {{idParam}}:
                deleted_{{entityName}} = {{dataVariable}}.pop(i)
                
                # Save data
                if not save_{{dataType}}({{dataVariable}}):
                    return jsonify({
                        'error': '데이터 저장에 실패했습니다.'
                    }), 500
                
                return jsonify({
                    'message': '{{deleteSuccessMessage}}',
                    'deleted_{{entityName}}': deleted_{{entityName}}
                }), 200
        
        return jsonify({
            'error': '{{entityName}}을(를) 찾을 수 없습니다.',
            'id': {{idParam}}
        }), 404
        
    except Exception as e:
        print(f"{{endpoint}}/{{{idParam}}} DELETE 오류: {e}")
        return jsonify({
            'error': '{{entityName}} 삭제 중 오류가 발생했습니다.',
            'message': str(e)
        }), 500

# Health check endpoint
@app.route('/health', methods=['GET'])
def health_check():
    """API 상태 확인"""
    return jsonify({
        'status': 'healthy',
        'message': '{{apiName}} API가 정상적으로 작동 중입니다!',
        'timestamp': datetime.now().isoformat()
    }), 200

# Error handlers
@app.errorhandler(404)
def not_found_error(error):
    return jsonify({
        'error': '요청한 리소스를 찾을 수 없습니다.',
        'message': 'Not Found'
    }), 404

@app.errorhandler(405)
def method_not_allowed_error(error):
    return jsonify({
        'error': '허용되지 않은 HTTP 메서드입니다.',
        'message': 'Method Not Allowed'
    }), 405

@app.errorhandler(500)
def internal_error(error):
    return jsonify({
        'error': '서버 내부 오류가 발생했습니다.',
        'message': 'Internal Server Error'
    }), 500

if __name__ == '__main__':
    print(f"🚀 {{apiName}} API 서버가 시작됩니다!")
    print(f"📡 엔드포인트: http://localhost:{{port}}/{{endpoint}}")
    print(f"💚 상태 확인: http://localhost:{{port}}/health")
    app.run(debug=True, host='0.0.0.0', port={{port}})

"""
Flask API Template Usage:
1. Replace {{dataFileName}} with your data file name (e.g., "scores", "players")
2. Replace {{dataType}} with your data type (e.g., "scores", "players") 
3. Replace {{entityName}} with singular entity name (e.g., "score", "player")
4. Replace {{endpoint}} with API endpoint path (e.g., "scores", "leaderboard")
5. Replace {{functionName}} with function name (e.g., "scores", "leaderboard")
6. Replace {{requiredFields}} with required field names in quotes (e.g., "'time', 'clicks'")
7. Replace {{optionalZeroField}} with field that can be zero (e.g., "'time'")
8. Replace {{additionalValidation}} with extra validation logic
9. Replace {{getDescription}} with GET endpoint description
10. Replace {{queryParameters}} with query parameter documentation
11. Replace {{getReturnDescription}} with GET return description
12. Replace {{queryParamLogic}} with query parameter handling
13. Replace {{dataProcessingLogic}} with data processing
14. Replace {{returnData}} with return data variable
15. Replace {{postDescription}} with POST endpoint description
16. Replace {{requestBodySchema}} with request body schema
17. Replace {{postReturnDescription}} with POST return description
18. Replace {{newRecordFields}} with new record field mapping
19. Replace {{idGenerationLogic}} with ID generation logic
20. Replace {{additionalProcessing}} with extra processing
21. Replace {{successMessage}} with success message
22. Replace {{additionalResponseData}} with extra response data
23. Replace {{idType}} with ID type (int, string)
24. Replace {{idParam}} with ID parameter name
25. Replace {{idField}} with ID field name in data
26. Replace {{idDescription}} with ID parameter description
27. Replace {{getByIdDescription}} with get by ID description
28. Replace {{getByIdReturnDescription}} with get by ID return description
29. Replace {{updateDescription}} with update description
30. Replace {{updateRequestBodySchema}} with update request schema
31. Replace {{updateReturnDescription}} with update return description
32. Replace {{updateLogic}} with update field logic
33. Replace {{updateSuccessMessage}} with update success message
34. Replace {{deleteDescription}} with delete description
35. Replace {{deleteReturnDescription}} with delete return description
36. Replace {{deleteSuccessMessage}} with delete success message
37. Replace {{apiName}} with API name
38. Replace {{port}} with port number
39. Replace {{CONFIG_CONSTANTS}} with configuration constants
40. Replace {{dataVariable}} with data variable name

Example for Scores API:
- dataFileName: "scores"
- dataType: "scores" 
- entityName: "score"
- endpoint: "score"
- functionName: "score"
- requiredFields: "'time', 'clicks'"
- port: "8000"
- apiName: "게임 점수"
"""