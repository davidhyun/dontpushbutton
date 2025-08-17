#!/bin/bash

# Don't Push Button - Docker Setup Script
# This script helps set up and manage the Docker containers for the application

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if Docker is installed and running
check_docker() {
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi

    if ! docker info &> /dev/null; then
        print_error "Docker is not running. Please start Docker first."
        exit 1
    fi

    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi

    print_success "Docker and Docker Compose are available"
}

# Function to build and start services
start_services() {
    local mode=${1:-"production"}
    
    print_status "Starting services in $mode mode..."
    
    if [ "$mode" = "development" ]; then
        print_status "Using development configuration with hot reload..."
        docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build -d
    else
        print_status "Using production configuration..."
        docker-compose up --build -d
    fi
    
    # Wait for services to be healthy
    print_status "Waiting for services to be healthy..."
    timeout 120 bash -c 'until docker-compose ps | grep -q "healthy"; do sleep 2; done' || {
        print_warning "Services may not be fully healthy yet. Check logs with: $0 logs"
    }
    
    print_success "Services started successfully!"
    print_status "Frontend: http://localhost:3000"
    print_status "Backend API: http://localhost:8000"
    print_status "API Documentation: http://localhost:8000/docs"
    print_status "Health Check: http://localhost:8000/health"
}

# Function to stop services
stop_services() {
    print_status "Stopping services..."
    docker-compose down
    print_success "Services stopped"
}

# Function to restart services
restart_services() {
    print_status "Restarting services..."
    docker-compose restart
    print_success "Services restarted"
}

# Function to view logs
view_logs() {
    local service=${1:-""}
    if [ -n "$service" ]; then
        print_status "Showing logs for $service..."
        docker-compose logs -f "$service"
    else
        print_status "Showing logs for all services..."
        docker-compose logs -f
    fi
}

# Function to clean up Docker resources
cleanup() {
    print_status "Cleaning up Docker resources..."
    docker-compose down -v
    docker system prune -f
    print_success "Cleanup completed"
}

# Function to show status
show_status() {
    print_status "Service status:"
    docker-compose ps
    echo
    print_status "Resource usage:"
    docker stats --no-stream
}

# Function to run health checks
health_check() {
    print_status "Running health checks..."
    
    # Check backend health
    if curl -f http://localhost:8000/health &> /dev/null; then
        print_success "Backend is healthy"
    else
        print_error "Backend health check failed"
    fi
    
    # Check frontend
    if curl -f http://localhost:3000 &> /dev/null; then
        print_success "Frontend is healthy"
    else
        print_error "Frontend health check failed"
    fi
}

# Function to show usage
show_usage() {
    echo "Don't Push Button - Docker Management Script"
    echo
    echo "Usage: $0 [COMMAND] [OPTIONS]"
    echo
    echo "Commands:"
    echo "  start [dev|prod]     Start services (default: production)"
    echo "  stop                 Stop services"
    echo "  restart              Restart services"
    echo "  logs [service]       View logs (all services or specific service)"
    echo "  status               Show service status and resource usage"
    echo "  health               Run health checks"
    echo "  cleanup              Clean up Docker resources"
    echo "  help                 Show this help message"
    echo
    echo "Examples:"
    echo "  $0 start dev         Start in development mode with hot reload"
    echo "  $0 start             Start in production mode"
    echo "  $0 logs backend      Show backend logs"
    echo "  $0 logs              Show all logs"
}

# Main script logic
main() {
    case "${1:-help}" in
        "start")
            check_docker
            start_services "${2:-production}"
            ;;
        "stop")
            stop_services
            ;;
        "restart")
            restart_services
            ;;
        "logs")
            view_logs "$2"
            ;;
        "status")
            show_status
            ;;
        "health")
            health_check
            ;;
        "cleanup")
            cleanup
            ;;
        "help"|"-h"|"--help")
            show_usage
            ;;
        *)
            print_error "Unknown command: $1"
            echo
            show_usage
            exit 1
            ;;
    esac
}

# Run main function with all arguments
main "$@"