from flask import Flask
from flask_cors import CORS
from backend.routes import api

def create_app():
    """Flask 애플리케이션 팩토리"""
    app = Flask(__name__)
    CORS(app)
    
    # 블루프린트 등록
    app.register_blueprint(api)
    
    return app

app = create_app()

if __name__ == '__main__':
    print("🎮 절대 누르면 안 되는 버튼 게임 서버가 시작됩니다!")
    print("📊 리더보드: http://localhost:8000/leaderboard")
    print("📈 통계: http://localhost:8000/stats")
    print("💚 상태 확인: http://localhost:8000/health")
    app.run(debug=True, host='0.0.0.0', port=8000)