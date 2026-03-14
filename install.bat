@echo off
echo ========================================
echo  ShopeeAff - Installing dependencies
echo ========================================

echo.
echo [1/2] Installing backend dependencies...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Backend install failed!
    pause
    exit /b 1
)

echo.
echo [2/2] Installing frontend dependencies...
cd ..\frontend
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Frontend install failed!
    pause
    exit /b 1
)

echo.
echo ========================================
echo  Setup complete!
echo  Run start.bat to launch the app.
echo ========================================
pause
