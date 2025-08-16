from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os
from datetime import datetime

app = Flask(__name__)
CORS(app)

SCORES_FILE = 'scores.json'

def load_scores():
    if os.path.exists(SCORES_FILE):
        with open(SCORES_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    return []

def save_scores(scores):
    with open(SCORES_FILE, 'w', encoding='utf-8') as f:
        json.dump(scores, f, ensure_ascii=False, indent=2)

@app.route('/leaderboard', methods=['GET'])
def get_leaderboard():
    scores = load_scores()
    # 시간이 긴 순서대로 정렬 (더 오래 버틴 사람이 상위)
    scores.sort(key=lambda x: x['time'], reverse=True)
    return jsonify(scores)

@app.route('/score', methods=['POST'])
def save_score():
    data = request.json
    time = data.get('time', 0)
    clicks = data.get('clicks', 0)
    
    scores = load_scores()
    
    new_score = {
        'time': time,
        'clicks': clicks,
        'timestamp': datetime.now().isoformat()
    }
    
    scores.append(new_score)
    save_scores(scores)
    
    return jsonify({'message': '점수가 저장되었습니다!', 'score': new_score})

@app.route('/stats', methods=['GET'])
def get_stats():
    scores = load_scores()
    
    if not scores:
        return jsonify({
            'total_games': 0,
            'best_time': 0,
            'average_time': 0,
            'total_clicks': 0
        })
    
    total_games = len(scores)
    best_time = max(scores, key=lambda x: x['time'])['time']
    average_time = sum(score['time'] for score in scores) / total_games
    total_clicks = sum(score['clicks'] for score in scores)
    
    return jsonify({
        'total_games': total_games,
        'best_time': best_time,
        'average_time': round(average_time, 2),
        'total_clicks': total_clicks
    })

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'message': '서버가 정상적으로 작동 중입니다!'})

if __name__ == '__main__':
    print("🎮 절대 누르면 안 되는 버튼 게임 서버가 시작됩니다!")
    print("📊 리더보드: http://localhost:8000/leaderboard")
    print("📈 통계: http://localhost:8000/stats")
    print("💚 상태 확인: http://localhost:8000/health")
    app.run(debug=True, host='0.0.0.0', port=8000)