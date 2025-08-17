#!/bin/bash

# Simple Docker Compose runner script
# Usage: ./run-docker.sh [dev|prod] [up|down|logs|status]

MODE=${1:-dev}
ACTION=${2:-up}

echo "🎮 Don't Push Button - Running Docker Compose in $MODE mode with action: $ACTION"

case $ACTION in
    "up")
        if [ "$MODE" = "dev" ]; then
            echo "🚀 Starting FastAPI development environment with hot reload..."
            docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build -d
            echo "📖 API Documentation: http://localhost:8000/docs"
        else
            echo "🚀 Starting FastAPI production environment..."
            docker compose -f docker-compose.yml up --build -d
            echo "📖 API Documentation: http://localhost:8000/docs"
        fi
        echo "🎯 Frontend: http://localhost:3000"
        echo "⚡ Backend API: http://localhost:8000"
        echo "💚 Health Check: http://localhost:8000/health"
        ;;
    "down")
        if [ "$MODE" = "dev" ]; then
            docker compose -f docker-compose.yml -f docker-compose.dev.yml down
        else
            docker compose -f docker-compose.yml down
        fi
        ;;
    "logs")
        if [ "$MODE" = "dev" ]; then
            docker compose -f docker-compose.yml -f docker-compose.dev.yml logs -f
        else
            docker compose -f docker-compose.yml logs -f
        fi
        ;;
    "status")
        docker compose ps
        ;;
    *)
        echo "Usage: $0 [dev|prod] [up|down|logs|status]"
        echo "Examples:"
        echo "  $0 dev up     # Start FastAPI development environment with hot reload"
        echo "  $0 prod up    # Start FastAPI production environment"
        echo "  $0 dev down   # Stop development environment"
        echo "  $0 dev logs   # View logs"
        echo "  $0 status     # Check status"
        ;;
esac