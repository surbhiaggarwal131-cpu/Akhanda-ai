@echo off
setlocal
cd /d "%~dp0"
if not exist "index.html" (
  echo ERROR: index.html is missing. Extract this ZIP first and run this file
  echo from the folder that contains index.html.
  pause
  exit /b 1
)
start "Akhanda Preview Server" cmd /k "cd /d ""%~dp0"" && python -m http.server 8000 --bind 127.0.0.1"
timeout /t 2 /nobreak >nul
start "" "http://127.0.0.1:8000/"
endlocal
