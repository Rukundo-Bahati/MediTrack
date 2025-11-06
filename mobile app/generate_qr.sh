#!/bin/bash

echo "MediTrack QR Code Generator"
echo "================================"
echo

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "Python 3 is not installed or not in PATH"
    echo "Please install Python 3 from your package manager or https://python.org"
    exit 1
fi

# Try quick generator first (handles missing dependencies gracefully)
echo "Attempting quick generation..."
python3 quick_generate.py

# If that fails, try the full setup
if [ $? -ne 0 ]; then
    echo
    echo "Trying full setup with virtual environment..."
    python3 setup_qr_generator.py
fi

echo
echo "Done! Check the 'qr_codes' directory for generated QR codes"