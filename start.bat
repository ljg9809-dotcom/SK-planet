@echo off
setlocal
cd /d "%~dp0"
set "NODE_EXE=node"
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js를 찾을 수 없습니다. Node.js 설치 후 다시 실행해 주세요.
  pause
  exit /b 1
)
start "" "http://localhost:8787/cardnews.html"
node server.js
if errorlevel 1 pause

