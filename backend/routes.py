from fastapi import APIRouter, HTTPException
from typing import List
from .models import ScoreManager, GameScore, ScoreRequest, ScoreResponse, StatsResponse, HealthResponse, SaveScoreResponse

api = APIRouter()
score_manager = ScoreManager()


@api.get('/leaderboard', response_model=List[ScoreResponse])
def get_leaderboard():
    """리더보드 조회 - 시간 순으로 정렬된 상위 점수들"""
    try:
        scores = score_manager.get_leaderboard()
        return [ScoreResponse(**score.to_dict()) for score in scores]
    except Exception as e:
        raise HTTPException(status_code=500, detail='리더보드를 가져올 수 없습니다')


@api.post('/score', response_model=SaveScoreResponse)
def save_score(score_data: ScoreRequest):
    """새로운 게임 점수 저장"""
    try:
        # 입력 검증 강화
        if score_data.time < 0 or score_data.time > 86400:  # 24시간 제한
            raise HTTPException(status_code=400, detail='유효하지 않은 시간입니다 (0-86400초)')
        if score_data.clicks < 0 or score_data.clicks > 1000:  # 클릭 수 제한  
            raise HTTPException(status_code=400, detail='유효하지 않은 클릭 수입니다 (0-1000회)')
        
        new_score = GameScore(time=score_data.time, clicks=score_data.clicks)
        saved_score = score_manager.add_score(new_score)
        
        return SaveScoreResponse(
            message='점수가 저장되었습니다!',
            score=ScoreResponse(**saved_score.to_dict())
        )
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail='점수를 저장할 수 없습니다')


@api.get('/stats', response_model=StatsResponse)
def get_stats():
    """게임 통계 정보 조회"""
    try:
        stats = score_manager.get_stats()
        return StatsResponse(**stats)
    except Exception as e:
        raise HTTPException(status_code=500, detail='통계를 가져올 수 없습니다')


@api.get('/health', response_model=HealthResponse)
def health_check():
    """서버 상태 확인"""
    return HealthResponse(
        status='healthy',
        message='서버가 정상적으로 작동 중입니다!'
    )