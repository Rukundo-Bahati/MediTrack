@echo off
echo MediTrack QR Code Generator
echo ================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo  Python is not installed or not in PATH
    echo Please install Python from https://python.org
    pause
    exit /b 1
)

REM Install dependencies and run generator
python setup_qr_generator.py

echo.
echo Press any key to exit...
pause >nul