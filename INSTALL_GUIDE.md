# Quick Installation Guide for Kali Linux

Since you're on Kali Linux with an externally managed Python environment, here are the easiest ways to generate QR codes:

## 🚀 Method 1: Quick Install with apt (Recommended)

```bash
# Install qrcode library system-wide using apt
sudo apt update
sudo apt install python3-qrcode

# Run the quick generator
python3 quick_generate.py
```

## 🔧 Method 2: Virtual Environment (Clean approach)

```bash
# Create virtual environment
python3 -m venv qr_venv

# Activate it
source qr_venv/bin/activate

# Install dependencies
pip install qrcode[pil]

# Generate QR codes
python generate_qr.py

# Deactivate when done
deactivate
```

## ⚡ Method 3: Force Install (Not recommended but works)

```bash
# Force install system-wide (bypasses protection)
pip install qrcode[pil] --break-system-packages

# Run generator
python3 generate_qr.py
```

## 🎯 Method 4: Use the automated script

```bash
# The updated script handles virtual environments automatically
./generate_qr.sh
```

## 📱 What You'll Get

After running any method, you'll have:

```
qr_codes/
├── BATCH-2025-001_authentic.png      # Amoxicillin (authentic)
├── BATCH-2025-002_authentic.png      # Paracetamol (authentic)  
├── BATCH-2025-003_authentic.png      # Aspirin (authentic)
├── BATCH-FAKE-001_counterfeit.png    # Ibuprofen (fake)
├── BATCH-FAKE-002_counterfeit.png    # Amoxicillin (fake)
└── batch_info.json                   # Batch details
```

## 🔍 Testing

1. Open MediTrack app on your phone
2. Scan any QR code from the `qr_codes/` directory
3. App will show verification results based on the batch ID
4. Authentic batches show ✅ with full provenance
5. Fake batches show ❌ as counterfeit

## 💡 QR Code Format

Each QR code contains: `batch:BATCH-ID`

Examples:
- `batch:BATCH-2025-001` → Shows as authentic Amoxicillin
- `batch:BATCH-FAKE-001` → Shows as counterfeit (any ID with "fake")

Your `utils/mockApi.ts` processes these IDs and returns the appropriate verification data.

---

**Recommendation: Use Method 1 (apt install) for the quickest setup on Kali Linux! 🐉**