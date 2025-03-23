@echo off

set VERSION=1.0.0

echo Deploying the project
docker build -t stream-share-frontend:%VERSION% -t stream-share-frontend:latest . --target production-stage --no-cache
