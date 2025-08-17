from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.routes import api

def create_app():
    """FastAPI 애플리케이션 팩토리"""
    app = FastAPI(
        title="절대 누르면 안 되는 버튼 게임",
        description="Don't Push The Button Game API",
        version="2.0.0"
    )
    
    # CORS 설정 (보안 강화)
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
        allow_credentials=True,
        allow_methods=["GET", "POST"],
        allow_headers=["*"],
    )
    
    # 라우터 등록
    app.include_router(api)
    
    return app

app = create_app()

if __name__ == '__main__':
    import uvicorn
    print("🎮 절대 누르면 안 되는 버튼 게임 서버가 시작됩니다!")
    print("📊 리더보드: http://localhost:8000/leaderboard")
    print("📈 통계: http://localhost:8000/stats")
    print("💚 상태 확인: http://localhost:8000/health")
    print("📖 API 문서: http://localhost:8000/docs")
    uvicorn.run("server:app", host="0.0.0.0", port=8000, reload=True)