#!/usr/bin/env python3
"""
QR Code Generator for MediTrack App
Generates QR codes containing batch IDs that will return mock verification data when scanned.
"""

import qrcode
import json
import os
from datetime import datetime, timedelta
import argparse

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

def create_qr_code(batch_data, output_dir="qr_codes"):
    """
    Create a QR code for a batch.
    The QR code contains the batch ID that the app will use to fetch verification data.
    """
    # Create output directory if it doesn't exist
    os.makedirs(output_dir, exist_ok=True)
    
    # The QR code contains the batch ID with 'batch:' prefix as expected by mockApi.ts
    qr_content = f"batch:{batch_data['batchId']}"
    
    # Create QR code instance
    qr = qrcode.QRCode(
        version=1,  # Controls the size of the QR Code
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

def generate_readme(output_dir="qr_codes"):
    """Generate a README file explaining the QR codes."""
    readme_file = os.path.join(output_dir, "README.md")
    
    readme_content = """# MediTrack QR Codes

This directory contains QR codes for testing the MediTrack app verification functionality.

## How to Use

1. Open the MediTrack app on your mobile device
2. Navigate to the scan functionality
3. Scan any of the QR code images in this directory
4. The app will display verification results based on the batch data

## QR Code Types

### Authentic Batches
- `BATCH-2025-001_authentic.png` - Amoxicillin 500mg (GoodPharma Ltd)
- `BATCH-2025-002_authentic.png` - Paracetamol 500mg (PharmaCorp Ltd)  
- `BATCH-2025-003_authentic.png` - Aspirin 100mg (HealthPharma)

### Counterfeit Batches (for testing)
- `BATCH-FAKE-001_counterfeit.png` - Fake Ibuprofen 200mg
- `BATCH-FAKE-002_counterfeit.png` - Fake Amoxicillin 500mg

## Technical Details

- QR codes contain batch IDs in format: `batch:BATCH-ID`
- The app's `mockApi.ts` processes these IDs and returns verification data
- Batches with "fake" in the ID will show as counterfeit
- All other batches will show as authentic with full provenance data

## Files

- `batch_info.json` - Complete batch information in JSON format
- `README.md` - This file
- `*.png` - QR code images

Generated on: {timestamp}
""".format(timestamp=datetime.now().strftime("%Y-%m-%d %H:%M:%S"))

    with open(readme_file, 'w') as f:
        f.write(readme_content)
    
    return readme_file

def main():
    parser = argparse.ArgumentParser(description='Generate QR codes for MediTrack app testing')
    parser.add_argument('--output', '-o', default='qr_codes', 
                       help='Output directory for QR codes (default: qr_codes)')
    parser.add_argument('--batch', '-b', 
                       help='Generate QR code for specific batch ID only')
    
    args = parser.parse_args()
    
    print("🏥 MediTrack QR Code Generator")
    print("=" * 40)
    
    # Create output directory
    os.makedirs(args.output, exist_ok=True)
    
    generated_files = []
    
    if args.batch:
        # Generate QR code for specific batch
        batch_data = next((b for b in MOCK_BATCHES if b['batchId'] == args.batch), None)
        if not batch_data:
            print(f"❌ Batch ID '{args.batch}' not found in mock data")
            print("Available batch IDs:")
            for batch in MOCK_BATCHES:
                print(f"  - {batch['batchId']}")
            return
        
        filepath, qr_content = create_qr_code(batch_data, args.output)
        generated_files.append(filepath)
        
        print(f"✅ Generated QR code for {batch_data['batchId']}")
        print(f"   File: {filepath}")
        print(f"   Content: {qr_content}")
        print(f"   Drug: {batch_data['drugName']}")
        print(f"   Status: {'✅ Authentic' if batch_data['authentic'] else '❌ Counterfeit'}")
        
    else:
        # Generate QR codes for all batches
        print(f"Generating QR codes for {len(MOCK_BATCHES)} batches...")
        print()
        
        for i, batch_data in enumerate(MOCK_BATCHES, 1):
            filepath, qr_content = create_qr_code(batch_data, args.output)
            generated_files.append(filepath)
            
            status_icon = "✅" if batch_data["authentic"] else "❌"
            status_text = "Authentic" if batch_data["authentic"] else "Counterfeit"
            
            print(f"{i}. {batch_data['batchId']}")
            print(f"   📦 {batch_data['drugName']}")
            print(f"   🏭 {batch_data['manufacturer']}")
            print(f"   {status_icon} {status_text}")
            print(f"   📄 {os.path.basename(filepath)}")
            print()
        
        # Generate additional files
        info_file = generate_batch_info_file(args.output)
        readme_file = generate_readme(args.output)
        
        print("📋 Additional files generated:")
        print(f"   - {os.path.basename(info_file)} (batch information)")
        print(f"   - {os.path.basename(readme_file)} (documentation)")
    
    print()
    print("🎉 QR code generation complete!")
    print(f"📁 Output directory: {os.path.abspath(args.output)}")
    print(f"📱 Scan these QR codes with the MediTrack app to test verification")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n❌ Generation cancelled by user")
    except Exception as e:
        print(f"\n❌ Error: {e}")
        print("Make sure you have the 'qrcode' package installed:")
        print("pip install qrcode[pil]")