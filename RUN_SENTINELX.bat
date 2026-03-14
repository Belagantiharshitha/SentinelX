@echo off
cd /d "%~dp0"
echo [SentinelX] LAUNCHING INTEGRATED SUITE
echo =====================================

:: 1. Start Backend
echo [1/3] Starting Backend (Port 8000)...
start "SentinelX - Backend" cmd /k "cd Backend && venv\Scripts\python -m uvicorn app.main:app --port 8000"

:: 2. Start SOC Frontend
echo [2/3] Starting SOC Dashboard (Port 5173)...
start "SentinelX - SOC" cmd /k "cd Frontend && npm run dev -- --port 5173"

:: 3. Start Novus Bank
echo [3/3] Starting Novus Bank (Port 5175)...
start "SentinelX - Bank" cmd /k "cd Novus-Bank && npm run dev -- --port 5175"

echo.
echo =====================================
echo SUCCESS: All systems initiating.
echo.
echo SentinelX Backend: http://localhost:8000
echo SOC Dashboard:     http://localhost:5173
echo Novus Bank:        http://localhost:5175
echo =====================================
pause
