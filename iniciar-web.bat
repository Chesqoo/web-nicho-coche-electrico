@echo off
REM Arranca la web en local. Requiere Node.js: https://nodejs.org
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
    echo No se encuentra Node.js. Instalalo desde https://nodejs.org y vuelve a ejecutar este script.
    pause
    exit /b 1
)
if not exist node_modules (
    echo Instalando dependencias ^(solo la primera vez^)...
    call npm install --no-audit --no-fund
)
echo Abriendo http://localhost:4321 ...
start http://localhost:4321
call npm run dev
