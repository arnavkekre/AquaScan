@echo off
title AquaScan Launcher (SIH26057)
echo ======================================================================
echo   AQUASCAN: AI Underwater Marine Debris Detection System
echo   Ministry of Earth Sciences (MoES) / NIOT
echo ======================================================================
echo.

echo [1/2] Starting FastAPI Backend on http://127.0.0.1:8000 ...
start "AquaScan Backend API" cmd /k "cd /d %~dp0backend && .\env\Scripts\activate && python run_backend.py"

timeout /t 3 /nobreak >nul

echo [2/2] Starting Vite Frontend on http://localhost:5173 ...
start "AquaScan Frontend Dashboard" cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo ======================================================================
echo   AquaScan system is launching!
echo   Frontend Dashboard: http://localhost:5173
echo   Swagger API Docs:   http://127.0.0.1:8000/docs
echo ======================================================================
pause
