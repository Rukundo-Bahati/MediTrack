#!/usr/bin/env python3
"""
Setup script for MediTrack QR Code Generator
Installs dependencies and runs the QR code generator
Handles externally managed Python environments by using virtual environments
"""

import subprocess
import sys
import os
import venv

def create_virtual_environment():
    """Create a virtual environment for the project."""
    venv_path = "qr_venv"
    
    if os.path.exists(venv_path):
        print(f"Virtual environment already exists at {venv_path}")
        return venv_path
    
    print("Creating virtual environment...")
    try:
        venv.create(venv_path, with_pip=True)
        print(f"Virtual environment created at {venv_path}")
        return venv_path
    except Exception as e:
        print(f"Failed to create virtual environment: {e}")
        return None

def get_venv_python(venv_path):
    """Get the Python executable path from virtual environment."""
    if os.name == 'nt':  # Windows
        return os.path.join(venv_path, "Scripts", "python.exe")
    else:  # Unix/Linux
        return os.path.join(venv_path, "bin", "python")

def get_venv_pip(venv_path):
    """Get the pip executable path from virtual environment."""
    if os.name == 'nt':  # Windows
        return os.path.join(venv_path, "Scripts", "pip.exe")
    else:  # Unix/Linux
        return os.path.join(venv_path, "bin", "pip")

def install_dependencies():
    """Install required Python packages in virtual environment."""
    print("Installing Python dependencies...")
    
    # Try system-wide installation first (for systems that allow it)
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"], 
                            stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        print("Dependencies installed system-wide!")
        return True, sys.executable
    except subprocess.CalledProcessError:
        pass
    
    # If system-wide fails, use virtual environment
    print("System-wide installation not allowed, using virtual environment...")
    
    venv_path = create_virtual_environment()
    if not venv_path:
        return False, None
    
    venv_pip = get_venv_pip(venv_path)
    venv_python = get_venv_python(venv_path)
    
    try:
        # Upgrade pip first
        print("   Upgrading pip...")
        subprocess.check_call([venv_python, "-m", "pip", "install", "--upgrade", "pip"], 
                            stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        
        # Install requirements
        print("   Installing qrcode library...")
        subprocess.check_call([venv_pip, "install", "-r", "requirements.txt"])
        print("Dependencies installed in virtual environment!")
        return True, venv_python
    except subprocess.CalledProcessError as e:
        print(f"Failed to install dependencies: {e}")
        return False, None

def run_qr_generator(python_executable):
    """Run the QR code generator."""
    print("\nRunning MediTrack QR Code Generator...")
    try:
        subprocess.check_call([python_executable, "generate_qr.py"])
        return True
    except subprocess.CalledProcessError as e:
        print(f"Failed to generate QR codes: {e}")
        return False

def main():
    print("MediTrack QR Code Generator Setup")
    print("=" * 40)
    
    # Check if requirements.txt exists
    if not os.path.exists("requirements.txt"):
        print("requirements.txt not found!")
        return
    
    # Check if generate_qr.py exists
    if not os.path.exists("generate_qr.py"):
        print("generate_qr.py not found!")
        return
    
    # Install dependencies
    success, python_executable = install_dependencies()
    if not success:
        print("\nFailed to install dependencies. Please try manual installation:")
        print("   python3 -m venv qr_venv")
        print("   source qr_venv/bin/activate  # On Windows: qr_venv\\Scripts\\activate")
        print("   pip install -r requirements.txt")
        print("   python generate_qr.py")
        return
    
    # Run QR generator
    if not run_qr_generator(python_executable):
        return
    
    print("\nSetup complete!")
    print("Check the 'qr_codes' directory for generated QR codes")
    print("Use these QR codes to test the MediTrack app")
    
    # Show virtual environment info if used
    if python_executable != sys.executable:
        print(f"\nVirtual environment created at: qr_venv/")
        print("   To run the generator again:")
        if os.name == 'nt':
            print("   qr_venv\\Scripts\\python generate_qr.py")
        else:
            print("   qr_venv/bin/python generate_qr.py")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\nSetup cancelled by user")
    except Exception as e:
        print(f"\nError: {e}")
        print("\nTry manual installation:")
        print("python3 -m venv qr_venv")
        print("source qr_venv/bin/activate")
        print("pip install -r requirements.txt")
        print("python generate_qr.py")