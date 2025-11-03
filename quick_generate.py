#!/usr/bin/env python3
"""
Quick QR Code Generator for MediTrack App
Generates QR codes without external dependencies using built-in libraries
"""

import json
import os
from datetime import datetime

# Try to import qrcode, if not available, provide instructions
try:
    import qrcode
    HAS_QRCODE = True
except ImportError:
    HAS_QRCODE = False

# Mock data structure based on mockApi.ts
MOCK_BATCHES = [
    {
        "batchId": "BATCH-2025-001",
        "drugName": "Amoxicillin 500mg",
        "lot": "LOT-12345",
        "manufacturer": "GoodPharma Ltd",
        "expiry": "2026-12-31",
        "authentic": True,
        "description": "Authentic Amoxicillin batch"
    },
    {
        "batchId": "BATCH-2025-002", 
        "drugName": "Paracetamol 500mg",
        "lot": "LOT-67890",
        "manufacturer": "PharmaCorp Ltd",
        "expiry": "2026-06-30",
        "authentic": True,
        "description": "Authentic Paracetamol batch"
    },
    {
        "batchId": "BATCH-FAKE-001",
        "drugName": "Ibuprofen 200mg", 
        "lot": "LOT-FAKE-123",
        "manufacturer": "SuspiciousPharma Inc",
        "expiry": "2025-03-15",
        "authentic": False,
        "description": "Counterfeit Ibuprofen batch (for testing)"
    },
    {
        "batchId": "BATCH-2025-003",
        "drugName": "Aspirin 100mg",
        "lot": "LOT-ASP-456", 
        "manufacturer": "HealthPharma",
        "expiry": "2026-09-20",
        "authentic": True,
        "description": "Authentic Aspirin batch"
    },
    {
        "batchId": "BATCH-FAKE-002",
        "drugName": "Amoxicillin 500mg",
        "lot": "LOT-FAKE-789",
        "manufacturer": "CounterfeitCorp",
        "expiry": "2024-12-31",
        "authentic": False,
        "description": "Counterfeit Amoxicillin batch (for testing)"
    }
]

def install_qrcode():
    """Provide instructions to install qrcode library."""
    print("❌ QR code library not found!")
    print("\nTo install the required library, run ONE of these commands:")
    print("\n🔧 Option 1: Using virtual environment (recommended for Kali/Ubuntu):")
    print("   python3 -m venv qr_venv")
    print("   source qr_venv/bin/activate")
    print("   pip install qrcode[pil]")
    print("   python quick_generate.py")
    print("\n🔧 Option 2: System-wide (if allowed):")
    print("   pip install qrcode[pil]")
    print("\n🔧 Option 3: Using apt (Debian/Ubuntu/Kali):")
    print("   sudo apt update")
    print("   sudo apt install python3-qrcode")
    print("\n🔧 Option 4: Force install (not recommended):")
    print("   pip install qrcode[pil] --break-system-packages")

def create_qr_code(batch_data, output_dir="qr_codes"):
    """Create a QR code for a batch."""
    if not HAS_QRCODE:
        return None, None
    
    # Create output directory if it doesn't exist
    os.makedirs(output_dir, exist_ok=True)
    
    # The QR code contains the batch ID with 'batch:' prefix as expected by mockApi.ts
    qr_content = f"batch:{batch_data['batchId']}"
    
    # Create QR code instance
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=10,
        border=4,
    )
    
    # Add data to QR code
    qr.add_data(qr_content)
    qr.make(fit=True)
    
    # Create QR code image
    img = qr.make_image(fill_color="black", back_color="white")
    
    # Generate filename
    status = "authentic" if batch_data["authentic"] else "counterfeit"
    filename = f"{batch_data['batchId']}_{status}.png"
    filepath = os.path.join(output_dir, filename)
    
    # Save the image
    img.save(filepath)
    
    return filepath, qr_content

def generate_batch_info_file(output_dir="qr_codes"):
    """Generate a JSON file with batch information for reference."""
    os.makedirs(output_dir, exist_ok=True)
    info_file = os.path.join(output_dir, "batch_info.json")
    
    batch_info = {
        "generated_at": datetime.now().isoformat(),
        "description": "QR codes for MediTrack app testing",
        "usage": "Scan these QR codes with the MediTrack app to test verification functionality",
        "batches": MOCK_BATCHES
    }
    
    with open(info_file, 'w') as f:
        json.dump(batch_info, f, indent=2)
    
    return info_file

def main():
    print("🏥 MediTrack Quick QR Code Generator")
    print("=" * 40)
    
    if not HAS_QRCODE:
        install_qrcode()
        return
    
    output_dir = "qr_codes"
    print(f"Generating QR codes for {len(MOCK_BATCHES)} batches...")
    print()
    
    generated_files = []
    
    for i, batch_data in enumerate(MOCK_BATCHES, 1):
        filepath, qr_content = create_qr_code(batch_data, output_dir)
        if filepath:
            generated_files.append(filepath)
            
            status_icon = "✅" if batch_data["authentic"] else "❌"
            status_text = "Authentic" if batch_data["authentic"] else "Counterfeit"
            
            print(f"{i}. {batch_data['batchId']}")
            print(f"   📦 {batch_data['drugName']}")
            print(f"   🏭 {batch_data['manufacturer']}")
            print(f"   {status_icon} {status_text}")
            print(f"   📄 {os.path.basename(filepath)}")
            print(f"   🔗 QR Content: {qr_content}")
            print()
    
    # Generate batch info file
    info_file = generate_batch_info_file(output_dir)
    
    print("📋 Additional files generated:")
    print(f"   - {os.path.basename(info_file)} (batch information)")
    
    print()
    print("🎉 QR code generation complete!")
    print(f"📁 Output directory: {os.path.abspath(output_dir)}")
    print(f"📱 Scan these QR codes with the MediTrack app to test verification")
    print()
    print("💡 QR Code Format:")
    print("   Each QR code contains: batch:BATCH-ID")
    print("   Your mockApi.ts will process these and return verification data")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n❌ Generation cancelled by user")
    except Exception as e:
        print(f"\n❌ Error: {e}")
        if not HAS_QRCODE:
            print("Make sure you have the 'qrcode' package installed")
        else:
            print("An unexpected error occurred")