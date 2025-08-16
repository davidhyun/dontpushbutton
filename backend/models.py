from dataclasses import dataclass
from datetime import datetime
from typing import List, Dict, Any
import json
import os


@dataclass
class GameScore:
    time: int
    clicks: int
    timestamp: str = None

    def __post_init__(self):
        if self.timestamp is None:
            self.timestamp = datetime.now().isoformat()

    def to_dict(self) -> Dict[str, Any]:
        return {
            'time': self.time,
            'clicks': self.clicks,
            'timestamp': self.timestamp
        }

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'GameScore':
        return cls(
            time=data.get('time', 0),
            clicks=data.get('clicks', 0),
            timestamp=data.get('timestamp')
        )


class ScoreManager:
    def __init__(self, filename: str = 'scores.json'):
        self.filename = filename

    def load_scores(self) -> List[GameScore]:
        if not os.path.exists(self.filename):
            return []
        
        try:
            with open(self.filename, 'r', encoding='utf-8') as f:
                data = json.load(f)
                return [GameScore.from_dict(score_data) for score_data in data]
        except (json.JSONDecodeError, FileNotFoundError):
            return []

    def save_scores(self, scores: List[GameScore]) -> None:
        score_dicts = [score.to_dict() for score in scores]
        with open(self.filename, 'w', encoding='utf-8') as f:
            json.dump(score_dicts, f, ensure_ascii=False, indent=2)

    def add_score(self, score: GameScore) -> GameScore:
        scores = self.load_scores()
        scores.append(score)
        self.save_scores(scores)
        return score

    def get_leaderboard(self, limit: int = 10) -> List[GameScore]:
        scores = self.load_scores()
        return sorted(scores, key=lambda x: x.time, reverse=True)[:limit]

    def get_stats(self) -> Dict[str, Any]:
        scores = self.load_scores()
        
        if not scores:
            return {
                'total_games': 0,
                'best_time': 0,
                'average_time': 0,
                'total_clicks': 0
            }
        
        times = [score.time for score in scores]
        clicks = [score.clicks for score in scores]
        
        return {
            'total_games': len(scores),
            'best_time': max(times),
            'average_time': round(sum(times) / len(times), 2),
            'total_clicks': sum(clicks)
        }