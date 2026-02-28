@echo off
setlocal

echo [SentinelX] Starting Backend and Frontend Integration...

:: Step 1: Backend Setup
echo [SentinelX] Setting up Backend...
cd Backend
if not exist venv (
    echo [SentinelX] Creating Python virtual environment...
    python -m venv venv
)
echo [SentinelX] Installing/Checking Backend dependencies...
venv\Scripts\pip install -r requirements.txt
if %ERRORLEVEL% neq 0 (
    echo [SentinelX] ERROR: Failed to install backend dependencies.
    pause
    exit /b %ERRORLEVEL%
)

:: Step 2: Frontend Setup
echo [SentinelX] Setting up Frontend...
cd ..
if not exist node_modules (
    echo [SentinelX] Installing Frontend dependencies...
    npm install
)

:: Step 3: Run Both
echo [SentinelX] Launching project...
:: Use venv\Scripts\python -m uvicorn to ensure it uses the venv packages
start "SentinelX Backend" cmd /k "cd Backend && venv\Scripts\python -m uvicorn app.main:app --reload --port 8000"
start "SentinelX Frontend" cmd /k "npm run dev"

echo [SentinelX] Services are starting!
echo Backend: http://localhost:8000
echo Frontend: http://localhost:5173
echo.
echo Press any key to exit this window (keeping services running)...
pause > nul
