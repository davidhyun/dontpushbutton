from flask import Blueprint, request, jsonify
from .models import ScoreManager, GameScore

api = Blueprint('api', __name__)
score_manager = ScoreManager()


@api.route('/leaderboard', methods=['GET'])
def get_leaderboard():
    """리더보드 조회 - 시간 순으로 정렬된 상위 점수들"""
    try:
        scores = score_manager.get_leaderboard()
        return jsonify([score.to_dict() for score in scores])
    except Exception as e:
        return jsonify({'error': '리더보드를 가져올 수 없습니다'}), 500


@api.route('/score', methods=['POST'])
def save_score():
    """새로운 게임 점수 저장"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': '데이터가 필요합니다'}), 400
        
        time = data.get('time', 0)
        clicks = data.get('clicks', 0)
        
        if time < 0 or clicks < 0:
            return jsonify({'error': '유효하지 않은 점수입니다'}), 400
        
        new_score = GameScore(time=time, clicks=clicks)
        saved_score = score_manager.add_score(new_score)
        
        return jsonify({
            'message': '점수가 저장되었습니다!',
            'score': saved_score.to_dict()
        })
    
    except Exception as e:
        return jsonify({'error': '점수를 저장할 수 없습니다'}), 500


@api.route('/stats', methods=['GET'])
def get_stats():
    """게임 통계 정보 조회"""
    try:
        stats = score_manager.get_stats()
        return jsonify(stats)
    except Exception as e:
        return jsonify({'error': '통계를 가져올 수 없습니다'}), 500


@api.route('/health', methods=['GET'])
def health_check():
    """서버 상태 확인"""
    return jsonify({
        'status': 'healthy',
        'message': '서버가 정상적으로 작동 중입니다!'
    })