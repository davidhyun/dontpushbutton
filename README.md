# 🚨 절대 누르면 안 되는 버튼 게임

> "참을 수 있을까요? 진짜로 안 누를 수 있을까요?" 🤔

React 프론트엔드와 Python Flask 백엔드로 구성된 중독성 있는 인내심 테스트 게임입니다.

## 🎯 게임 규칙

1. 🔴 **빨간 버튼을 절대 누르면 안 됩니다**
2. ⏱️ 얼마나 오래 참을 수 있는지 시간을 측정합니다
3. 💥 한 번 누르면 게임이 즉시 종료됩니다
4. 🏆 리더보드에서 최고 기록을 확인할 수 있습니다

## 🚀 빠른 시작

### 필수 요구사항
- Python 3.7+
- Node.js 14+
- npm

### 1. 저장소 클론
```bash
git clone https://github.com/davidhyun/dontpushbutton.git
cd dontpushbutton
```

### 2. 백엔드 서버 실행
```bash
# Python 의존성 설치
pip install -r requirements.txt

# 서버 실행
python server.py
```
🌐 서버: http://localhost:8000

### 3. 프론트엔드 실행
```bash
# Node.js 의존성 설치
npm install

# React 앱 실행
npm start
```
🎮 게임: http://localhost:3000

## 📁 프로젝트 구조

```
dontpushbutton/
├── 📁 src/                     # React 프론트엔드
│   ├── 📁 components/          # React 컴포넌트
│   │   ├── GameButton.js       # 게임 버튼 컴포넌트
│   │   └── GameOverScreen.js   # 게임 오버 화면
│   ├── 📁 hooks/               # 커스텀 훅
│   │   └── useGameTimer.js     # 게임 타이머 훅
│   ├── 📁 services/            # API 서비스
│   │   └── api.js              # API 통신 로직
│   ├── App.js                  # 메인 앱 컴포넌트
│   └── App.css                 # 스타일시트
├── 📁 backend/                 # Flask 백엔드
│   ├── models.py               # 데이터 모델
│   └── routes.py               # API 라우트
├── server.py                   # Flask 서버 엔트리포인트
├── requirements.txt            # Python 의존성
└── package.json               # Node.js 의존성
```

## 🔌 API 엔드포인트

| 메서드 | 엔드포인트 | 설명 |
|--------|-----------|------|
| `GET` | `/leaderboard` | 🏆 리더보드 조회 (상위 10개) |
| `POST` | `/score` | 💾 점수 저장 |
| `GET` | `/stats` | 📊 게임 통계 |
| `GET` | `/health` | 💚 서버 상태 확인 |

### 점수 저장 예시
```bash
curl -X POST http://localhost:8000/score \
  -H "Content-Type: application/json" \
  -d '{"time": 120, "clicks": 1}'
```

## 🛠️ 기술 스택

### 프론트엔드
- ⚛️ **React 18** - UI 라이브러리
- 🌐 **Axios** - HTTP 클라이언트
- 🎨 **CSS3** - 스타일링 (그라디언트, 애니메이션)

### 백엔드
- 🐍 **Python Flask** - 웹 프레임워크
- 🔗 **Flask-CORS** - CORS 처리
- 📦 **Dataclasses** - 데이터 모델링
- 📄 **JSON** - 데이터 저장

## 🎨 주요 기능

- ✨ **반응형 디자인** - 모든 디바이스에서 완벽한 경험
- 🎭 **스무스 애니메이션** - CSS 트랜지션과 키프레임
- 📊 **실시간 통계** - 게임 플레이 통계 추적
- 🏆 **리더보드** - 최고 기록 저장 및 표시
- 🔄 **상태 관리** - 커스텀 훅을 활용한 깔끔한 상태 관리

## 🧪 개발 및 테스트

### 코드 품질
```bash
# 린트 실행 (있는 경우)
npm run lint

# 타입 체크 실행 (있는 경우)
npm run typecheck
```

### 프로덕션 빌드
```bash
# React 앱 빌드
npm run build

# 빌드된 파일은 build/ 폴더에 생성됩니다
```

## 🤝 기여하기

1. 이 저장소를 포크합니다
2. 기능 브랜치를 만듭니다 (`git checkout -b feature/amazing-feature`)
3. 변경사항을 커밋합니다 (`git commit -m 'Add amazing feature'`)
4. 브랜치에 푸시합니다 (`git push origin feature/amazing-feature`)
5. Pull Request를 만듭니다

## 📝 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 🎮 게임 플레이 팁

- 🧘‍♀️ **명상하세요** - 마음을 비우고 버튼을 무시하세요
- 👀 **시선을 돌리세요** - 다른 곳을 보며 유혹을 피하세요  
- ⏰ **시간 확인 금지** - 타이머를 보면 더 누르고 싶어집니다
- 🎵 **음악 듣기** - 좋아하는 음악으로 주의를 분산시키세요

> **경고**: 이 게임은 중독성이 있을 수 있습니다. 적당히 즐기세요! 😄