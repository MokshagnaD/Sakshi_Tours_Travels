@echo off
echo Starting Sakshi Tours & Travels Development Environment...
echo.

echo [1/2] Starting Backend Server...
start "Backend Server" cmd /k "cd backend && npm run dev"

echo [2/2] Starting Frontend Application...
timeout /t 3 /nobreak > nul
start "Frontend App" cmd /k "cd frontend && npm run dev"

echo.
echo Development servers are starting...
echo Backend: http://localhost:5001
echo Frontend: http://localhost:5173
echo.
echo Press any key to exit...
pause > nul