# 절대 누르면 안 되는 버튼 게임

React 프론트엔드와 Python Flask 백엔드로 구성된 간단한 게임입니다.

## 게임 규칙

1. 빨간 버튼을 절대 누르면 안 됩니다
2. 얼마나 오래 참을 수 있는지 시간을 측정합니다
3. 10번 누르면 게임이 종료됩니다
4. 리더보드에서 최고 기록을 확인할 수 있습니다

## 실행 방법

### 백엔드 서버 실행

```bash
# Python 의존성 설치
pip install -r requirements.txt

# 서버 실행
python server.py
```

서버는 http://localhost:8000 에서 실행됩니다.

### 프론트엔드 실행

```bash
# Node.js 의존성 설치
npm install

# React 앱 실행
npm start
```

앱은 http://localhost:3000 에서 실행됩니다.

## API 엔드포인트

- `GET /leaderboard` - 리더보드 조회
- `POST /score` - 점수 저장
- `GET /stats` - 게임 통계
- `GET /health` - 서버 상태 확인

## 기술 스택

- **프론트엔드**: React, Axios
- **백엔드**: Python Flask, Flask-CORS
- **데이터 저장**: JSON 파일