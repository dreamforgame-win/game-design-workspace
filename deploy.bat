@echo off

if not exist "package.json" (
    echo [ERROR] Run this script in project root directory
    pause
    exit /b 1
)

set HTTP_PROXY=http://127.0.0.1:7897
set HTTPS_PROXY=http://127.0.0.1:7897

echo ============================================
echo   Game Design Workspace - Deploy
echo ============================================
echo.

echo [1/3] Adding changes...
git add .

echo [2/3] Committing...
git commit -m "update"

echo [3/3] Pushing to GitHub...
git push origin main

if %errorlevel% neq 0 (
    echo [ERROR] Push failed
    pause
    exit /b 1
)

echo.
echo [OK] Push complete! Vercel will auto-deploy.
echo.
pause
