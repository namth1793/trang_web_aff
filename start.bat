@echo off
echo ========================================
echo  ShopeeAff - Starting Application
echo ========================================
echo.
echo  Backend:  http://localhost:5001
echo  Frontend: http://localhost:3000
echo  Admin:    http://localhost:3000/admin
echo  Password: admin123
echo ========================================

start "Backend" cmd /k "cd /d %~dp0backend && npm run dev"
timeout /t 2 /nobreak >nul
start "Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo Both servers are starting...
echo Press any key to exit this window.
pause
