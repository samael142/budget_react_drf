#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
IMAGE_NAME="budget-dev-proxy:dev"
CONTAINER_NAME="budget-dev-proxy"
frontend_pid=""
proxy_started=false

cleanup() {
    local exit_status=$?
    trap - EXIT INT TERM

    if [[ -n "$frontend_pid" ]]; then
        kill "$frontend_pid" 2>/dev/null || true
        wait "$frontend_pid" 2>/dev/null || true
    fi

    if [[ "$proxy_started" == true ]]; then
        docker stop "$CONTAINER_NAME" >/dev/null 2>&1 || true
    fi
    exit "$exit_status"
}

trap cleanup EXIT
trap 'exit 130' INT
trap 'exit 143' TERM

if ! command -v docker >/dev/null 2>&1; then
    echo "Docker is required to run the development proxy." >&2
    exit 1
fi

if ! command -v npm >/dev/null 2>&1; then
    echo "npm is required to run the frontend development server." >&2
    exit 1
fi

docker build -t "$IMAGE_NAME" "$ROOT_DIR/devProxy"
docker run --rm --detach \
    --name "$CONTAINER_NAME" \
    --add-host=host.docker.internal:host-gateway \
    --publish 80:80 \
    "$IMAGE_NAME"
proxy_started=true

cd "$ROOT_DIR/frontend"
echo "Frontend and development proxy are running at http://localhost"
echo "Backend API must be available at http://localhost:8000/api/"
HOST=0.0.0.0 npm start &
frontend_pid=$!
wait "$frontend_pid"
