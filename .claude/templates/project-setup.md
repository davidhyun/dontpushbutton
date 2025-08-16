# Project Setup Template

## Quick Start Commands

### Development Setup
```bash
# Install dependencies
npm install
pip install -r requirements.txt

# Start development servers
# Terminal 1: Backend
python server.py

# Terminal 2: Frontend  
npm start
```

### Git Workflow
```bash
# Create feature branch
git checkout -b feature/{{feature-name}}

# Commit changes
git add .
git commit -m "feat: add {{feature description}}

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>"

# Push to remote
git push origin feature/{{feature-name}}
```

### Testing
```bash
# Test backend
python -m pytest tests/

# Test frontend
npm test

# Build for production
npm run build
```

## Project Structure
```
dontpushbutton/
├── public/           # React public files
├── src/             # React source code
│   ├── App.js       # Main React component
│   ├── App.css      # Main styles
│   └── index.js     # React entry point
├── server.py        # Python Flask backend
├── requirements.txt # Python dependencies
├── package.json     # Node.js dependencies
└── README.md        # Project documentation
```

## Environment Variables
```bash
# .env file (if needed)
REACT_APP_API_URL=http://localhost:8000
FLASK_ENV=development
```

## Deployment Checklist
- [ ] Update version in package.json
- [ ] Run tests
- [ ] Build production bundle
- [ ] Update documentation
- [ ] Create release notes