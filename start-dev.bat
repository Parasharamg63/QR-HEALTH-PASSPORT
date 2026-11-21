@echo off
echo ========================================================
echo         QR HEALTH PASSPORT - MERN LAUNCHER
echo ========================================================
echo Starting Backend API on http://localhost:5000 ...
start "QR Health Backend API" cmd /k "cd backend && npm start"

echo Starting Frontend on http://localhost:5173 ...
start "QR Health Frontend" cmd /k "cd frontend && npm run dev"

echo ========================================================
echo App running! Open your browser at http://localhost:5173
echo ========================================================
pause
