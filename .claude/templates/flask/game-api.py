from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os
from datetime import datetime
from typing import Dict, List, Optional, Any
import uuid

app = Flask(__name__)
CORS(app)

# Game Configuration
GAME_DATA_FILE = '{{gameDataFile}}.json'
GAME_CONFIG = {
    'max_{{gameMetric}}': {{maxValue}},
    'min_{{gameMetric}}': {{minValue}},
    'time_limit': {{timeLimit}},  # seconds
    'scoring_multiplier': {{scoringMultiplier}},
    {{additionalGameConfig}}
}

def load_game_data() -> Dict[str, Any]:
    """
    Load game data from JSON file
    
    Returns:
        Dict: Game data including scores, stats, and configuration
    """
    if os.path.exists(GAME_DATA_FILE):
        try:
            with open(GAME_DATA_FILE, 'r', encoding='utf-8') as f:
                data = json.load(f)
                # Ensure required keys exist
                if 'scores' not in data:
                    data['scores'] = []
                if 'sessions' not in data:
                    data['sessions'] = []
                if 'stats' not in data:
                    data['stats'] = {}
                return data
        except (json.JSONDecodeError, FileNotFoundError) as e:
            print(f"게임 데이터 파일 로드 오류: {e}")
    
    return {
        'scores': [],
        'sessions': [],
        'stats': {}
    }

def save_game_data(data: Dict[str, Any]) -> bool:
    """
    Save game data to JSON file
    
    Args:
        data: Game data to save
        
    Returns:
        bool: True if successful, False otherwise
    """
    try:
        with open(GAME_DATA_FILE, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        return True
    except Exception as e:
        print(f"게임 데이터 저장 오류: {e}")
        return False

def calculate_score(game_result: Dict[str, Any]) -> int:
    """
    Calculate game score based on result data
    
    Args:
        game_result: Game result data
        
    Returns:
        int: Calculated score
    """
    base_score = game_result.get('{{primaryMetric}}', 0)
    {{scoreCalculationLogic}}
    
    return max(0, int(final_score))

def validate_game_result(data: Dict[str, Any]) -> tuple[bool, str]:
    """
    Validate game result data
    
    Args:
        data: Game result data to validate
        
    Returns:
        tuple: (is_valid, error_message)
    """
    required_fields = [{{gameResultRequiredFields}}]
    
    for field in required_fields:
        if field not in data:
            return False, f"필수 필드가 누락되었습니다: {field}"
    
    # Validate ranges
    {{gameValidationLogic}}
    
    return True, ""

@app.route('/game/start', methods=['POST'])
def start_game_session():
    """
    Start a new game session
    
    Request Body:
        {
            "player_id": "optional_player_id",
            "difficulty": "easy|medium|hard",
            "game_mode": "{{gameMode1}}|{{gameMode2}}|{{gameMode3}}"
        }
    
    Returns:
        JSON: Session information
    """
    try:
        data = request.get_json() or {}
        
        game_data = load_game_data()
        
        session_id = str(uuid.uuid4())
        new_session = {
            'session_id': session_id,
            'player_id': data.get('player_id'),
            'difficulty': data.get('difficulty', 'medium'),
            'game_mode': data.get('game_mode', '{{defaultGameMode}}'),
            'start_time': datetime.now().isoformat(),
            'status': 'active',
            'config': GAME_CONFIG.copy(),
            {{additionalSessionFields}}
        }
        
        # Adjust config based on difficulty
        if new_session['difficulty'] == 'easy':
            new_session['config']['{{difficultyMetric}}'] *= 1.5
        elif new_session['difficulty'] == 'hard':
            new_session['config']['{{difficultyMetric}}'] *= 0.7
        
        game_data['sessions'].append(new_session)
        save_game_data(game_data)
        
        return jsonify({
            'message': '게임 세션이 시작되었습니다!',
            'session': new_session
        }), 201
        
    except Exception as e:
        print(f"게임 시작 오류: {e}")
        return jsonify({
            'error': '게임 세션 시작 중 오류가 발생했습니다.',
            'message': str(e)
        }), 500

@app.route('/game/end', methods=['POST'])
def end_game_session():
    """
    End a game session and record results
    
    Request Body:
        {
            "session_id": "session_uuid",
            {{gameResultSchema}}
        }
    
    Returns:
        JSON: Game result and score information
    """
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({
                'error': '게임 결과 데이터가 필요합니다.'
            }), 400
        
        session_id = data.get('session_id')
        if not session_id:
            return jsonify({
                'error': 'session_id가 필요합니다.'
            }), 400
        
        # Validate game result
        is_valid, error_message = validate_game_result(data)
        if not is_valid:
            return jsonify({
                'error': '유효하지 않은 게임 결과입니다.',
                'message': error_message
            }), 400
        
        game_data = load_game_data()
        
        # Find and update session
        session = None
        for s in game_data['sessions']:
            if s['session_id'] == session_id:
                session = s
                break
        
        if not session:
            return jsonify({
                'error': '게임 세션을 찾을 수 없습니다.',
                'session_id': session_id
            }), 404
        
        if session['status'] != 'active':
            return jsonify({
                'error': '이미 종료된 게임 세션입니다.',
                'session_id': session_id
            }), 400
        
        # Calculate score
        score = calculate_score(data)
        
        # Create score record
        score_record = {
            'session_id': session_id,
            'player_id': session.get('player_id'),
            'score': score,
            {{gameResultFields}},
            'difficulty': session['difficulty'],
            'game_mode': session['game_mode'],
            'end_time': datetime.now().isoformat(),
            'duration': {{durationCalculation}},
            'timestamp': datetime.now().isoformat()
        }
        
        # Update session
        session['status'] = 'completed'
        session['end_time'] = datetime.now().isoformat()
        session['result'] = score_record
        
        # Add to scores
        game_data['scores'].append(score_record)
        
        # Update game statistics
        update_game_stats(game_data, score_record)
        
        save_game_data(game_data)
        
        return jsonify({
            'message': '게임 세션이 완료되었습니다!',
            'result': score_record,
            'rank': get_score_rank(game_data['scores'], score),
            'stats': get_session_stats(game_data, session['game_mode'])
        }), 200
        
    except Exception as e:
        print(f"게임 종료 오류: {e}")
        return jsonify({
            'error': '게임 세션 종료 중 오류가 발생했습니다.',
            'message': str(e)
        }), 500

def update_game_stats(game_data: Dict[str, Any], score_record: Dict[str, Any]):
    """Update game statistics with new score record"""
    stats = game_data['stats']
    game_mode = score_record['game_mode']
    
    if game_mode not in stats:
        stats[game_mode] = {
            'total_games': 0,
            'best_score': 0,
            'average_score': 0,
            'total_score': 0,
            {{additionalStatsFields}}
        }
    
    mode_stats = stats[game_mode]
    mode_stats['total_games'] += 1
    mode_stats['total_score'] += score_record['score']
    mode_stats['average_score'] = mode_stats['total_score'] / mode_stats['total_games']
    mode_stats['best_score'] = max(mode_stats['best_score'], score_record['score'])
    
    {{additionalStatsUpdates}}

def get_score_rank(scores: List[Dict[str, Any]], current_score: int) -> int:
    """Get rank of current score"""
    better_scores = len([s for s in scores if s['score'] > current_score])
    return better_scores + 1

def get_session_stats(game_data: Dict[str, Any], game_mode: str) -> Dict[str, Any]:
    """Get statistics for a specific game mode"""
    return game_data['stats'].get(game_mode, {
        'total_games': 0,
        'best_score': 0,
        'average_score': 0
    })

@app.route('/game/leaderboard', methods=['GET'])
def get_leaderboard():
    """
    Get game leaderboard
    
    Query Parameters:
        game_mode: Filter by game mode
        difficulty: Filter by difficulty
        limit: Limit number of results (default: 10)
    
    Returns:
        JSON: Leaderboard data
    """
    try:
        game_data = load_game_data()
        scores = game_data['scores'].copy()
        
        # Apply filters
        game_mode = request.args.get('game_mode')
        difficulty = request.args.get('difficulty')
        limit = int(request.args.get('limit', 10))
        
        if game_mode:
            scores = [s for s in scores if s.get('game_mode') == game_mode]
        
        if difficulty:
            scores = [s for s in scores if s.get('difficulty') == difficulty]
        
        # Sort by score (highest first)
        scores.sort(key=lambda x: x['score'], reverse=True)
        
        # Limit results
        scores = scores[:limit]
        
        # Add rank
        for i, score in enumerate(scores):
            score['rank'] = i + 1
        
        return jsonify({
            'leaderboard': scores,
            'total_scores': len(game_data['scores']),
            'filtered_count': len(scores)
        }), 200
        
    except Exception as e:
        print(f"리더보드 조회 오류: {e}")
        return jsonify({
            'error': '리더보드를 가져오는 중 오류가 발생했습니다.',
            'message': str(e)
        }), 500

@app.route('/game/stats', methods=['GET'])
def get_game_stats():
    """
    Get overall game statistics
    
    Query Parameters:
        game_mode: Get stats for specific game mode
    
    Returns:
        JSON: Game statistics
    """
    try:
        game_data = load_game_data()
        game_mode = request.args.get('game_mode')
        
        if game_mode:
            # Return stats for specific game mode
            mode_stats = game_data['stats'].get(game_mode, {})
            return jsonify({
                'game_mode': game_mode,
                'stats': mode_stats
            }), 200
        else:
            # Return overall stats
            all_stats = game_data['stats']
            overall = {
                'total_games': sum(stats.get('total_games', 0) for stats in all_stats.values()),
                'total_sessions': len(game_data['sessions']),
                'game_modes': list(all_stats.keys()),
                'mode_stats': all_stats
            }
            return jsonify(overall), 200
        
    except Exception as e:
        print(f"통계 조회 오류: {e}")
        return jsonify({
            'error': '통계를 가져오는 중 오류가 발생했습니다.',
            'message': str(e)
        }), 500

@app.route('/game/config', methods=['GET'])
def get_game_config():
    """Get current game configuration"""
    return jsonify({
        'config': GAME_CONFIG,
        'supported_difficulties': ['easy', 'medium', 'hard'],
        'supported_game_modes': [{{supportedGameModes}}]
    }), 200

@app.route('/health', methods=['GET'])
def health_check():
    """API 상태 확인"""
    return jsonify({
        'status': 'healthy',
        'message': '{{gameName}} API가 정상적으로 작동 중입니다!',
        'timestamp': datetime.now().isoformat(),
        'version': '1.0.0'
    }), 200

if __name__ == '__main__':
    print(f"🎮 {{gameName}} API 서버가 시작됩니다!")
    print(f"🎯 게임 시작: http://localhost:{{port}}/game/start")
    print(f"🏁 게임 종료: http://localhost:{{port}}/game/end")
    print(f"🏆 리더보드: http://localhost:{{port}}/game/leaderboard")
    print(f"📊 통계: http://localhost:{{port}}/game/stats")
    print(f"💚 상태 확인: http://localhost:{{port}}/health")
    app.run(debug=True, host='0.0.0.0', port={{port}})

"""
Game API Template Usage:
1. Replace {{gameDataFile}} with your game data file name (e.g., "game_data")
2. Replace {{gameMetric}} with main game metric (e.g., "time", "clicks", "score")
3. Replace {{maxValue}} with maximum allowed value
4. Replace {{minValue}} with minimum allowed value 
5. Replace {{timeLimit}} with time limit in seconds
6. Replace {{scoringMultiplier}} with scoring multiplier
7. Replace {{additionalGameConfig}} with extra game configuration
8. Replace {{gameMode1}}, {{gameMode2}}, {{gameMode3}} with game modes
9. Replace {{defaultGameMode}} with default game mode
10. Replace {{primaryMetric}} with primary scoring metric
11. Replace {{scoreCalculationLogic}} with score calculation
12. Replace {{gameResultRequiredFields}} with required result fields
13. Replace {{gameValidationLogic}} with validation logic
14. Replace {{additionalSessionFields}} with extra session fields
15. Replace {{difficultyMetric}} with difficulty adjustment metric
16. Replace {{gameResultSchema}} with game result schema
17. Replace {{gameResultFields}} with game result field mapping
18. Replace {{durationCalculation}} with duration calculation
19. Replace {{additionalStatsFields}} with extra statistics fields
20. Replace {{additionalStatsUpdates}} with extra statistics updates
21. Replace {{supportedGameModes}} with supported game modes list
22. Replace {{gameName}} with game name
23. Replace {{port}} with port number

Example for "Don't Push Button" Game:
- gameDataFile: "button_game_data"
- gameMetric: "time"
- maxValue: "3600"
- minValue: "0"
- timeLimit: "null"
- scoringMultiplier: "1"
- gameMode1: "classic"
- gameMode2: "challenge"
- gameMode3: "endless"
- defaultGameMode: "classic"
- primaryMetric: "time"
- gameResultRequiredFields: "'time', 'clicks'"
- gameName: "절대 누르면 안 되는 버튼 게임"
- port: "8000"
"""