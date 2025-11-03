# MediTrack QR Code Generator

This Python script generates QR codes for testing the MediTrack app's verification functionality. The QR codes contain batch IDs that correspond to the mock data defined in `utils/mockApi.ts`.

## 🚀 Quick Start

### Option 1: Automatic Setup (Recommended)

**Windows:**
```bash
# Double-click generate_qr.bat or run in command prompt:
generate_qr.bat
```

**macOS/Linux:**
```bash
# Make executable and run:
chmod +x generate_qr.sh
./generate_qr.sh
```

### Option 2: Manual Setup

1. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Generate QR codes:**
   ```bash
   python generate_qr.py
   ```

## 📱 Usage

1. Run the generator to create QR codes in the `qr_codes/` directory
2. Open the MediTrack app on your mobile device
3. Use the scan functionality to scan any generated QR code
4. The app will display verification results based on the mock data

## 🎯 Generated QR Codes

The script generates QR codes for these mock batches:

### ✅ Authentic Batches
- **BATCH-2025-001** - Amoxicillin 500mg (GoodPharma Ltd)
- **BATCH-2025-002** - Paracetamol 500mg (PharmaCorp Ltd)
- **BATCH-2025-003** - Aspirin 100mg (HealthPharma)

### ❌ Counterfeit Batches (for testing)
- **BATCH-FAKE-001** - Fake Ibuprofen 200mg
- **BATCH-FAKE-002** - Fake Amoxicillin 500mg

## 🔧 Advanced Usage

### Generate specific batch QR code:
```bash
python generate_qr.py --batch BATCH-2025-001
```

### Custom output directory:
```bash
python generate_qr.py --output my_qr_codes
```

### Help:
```bash
python generate_qr.py --help
```

## 📁 Output Files

After running the generator, you'll find:

```
qr_codes/
├── BATCH-2025-001_authentic.png
├── BATCH-2025-002_authentic.png
├── BATCH-2025-003_authentic.png
├── BATCH-FAKE-001_counterfeit.png
├── BATCH-FAKE-002_counterfeit.png
├── batch_info.json              # Complete batch data
└── README.md                    # Documentation
```

## 🔍 Technical Details

### QR Code Format
- QR codes contain batch IDs in format: `batch:BATCH-ID`
- This matches the expected format in `utils/mockApi.ts`
- The `verifyQR()` function processes these IDs and returns mock verification data

### Mock Data Integration
- Batch IDs containing "fake" will show as counterfeit
- All other batches show as authentic with full provenance data
- Data structure matches the verification response in `mockApi.ts`

### Verification Flow
1. User scans QR code containing `batch:BATCH-ID`
2. App calls `verifyQR(qrContent)` in `mockApi.ts`
3. Function extracts batch ID and returns mock verification data
4. App displays verification results with provenance information

## 🛠️ Requirements

- Python 3.6+
- qrcode library with PIL support
- Pillow (Python Imaging Library)

## 📋 Mock Data Structure

Each batch contains:
```json
{
  "batchId": "BATCH-2025-001",
  "drugName": "Amoxicillin 500mg",
  "lot": "LOT-12345", 
  "manufacturer": "GoodPharma Ltd",
  "expiry": "2026-12-31",
  "authentic": true,
  "provenance": [
    {"event": "BatchRegistered", "timestamp": "..."},
    {"event": "Shipped", "location": "Warehouse A"},
    {"event": "Received", "location": "Distributor Hub"}
  ]
}
```

## 🎨 Customization

To add new mock batches:

1. Edit the `MOCK_BATCHES` array in `generate_qr.py`
2. Add corresponding data to `utils/mockApi.ts` if needed
3. Run the generator to create new QR codes

## 🐛 Troubleshooting

**"qrcode module not found":**
```bash
pip install qrcode[pil]
```

**"PIL/Pillow not found":**
```bash
pip install Pillow
```

**Permission denied on Linux/macOS:**
```bash
chmod +x generate_qr.sh
```

## 📞 Support

If you encounter issues:
1. Ensure Python 3.6+ is installed
2. Install dependencies: `pip install -r requirements.txt`
3. Check that the MediTrack app is properly configured to handle QR scanning
4. Verify that `utils/mockApi.ts` contains the expected mock data

---

**Happy testing! 🏥📱**