# MediTrack

**Blockchain-Powered Medicine Verification System**

MediTrack is a comprehensive mobile application that leverages blockchain technology to combat counterfeit medicines and ensure pharmaceutical supply chain integrity. Built with React Native and Expo, it provides real-time verification of medicine authenticity through QR code scanning and immutable blockchain records.

## The Problem We Solve

**Counterfeit medicines are a global crisis:**
- **500,000+ deaths annually** in developing regions from fake medicines
- **$200+ billion** global market for counterfeit pharmaceuticals
- **1 in 10 medicines** in low and middle-income countries are substandard or falsified
- **Lack of transparency** in pharmaceutical supply chains
- **Difficulty verifying authenticity** at point of purchase

## Our Solution

MediTrack creates an **immutable, transparent, and accessible** system for medicine verification:

### **Blockchain-Based Verification**
- Every medicine batch is registered on Ethereum blockchain
- Tamper-proof provenance tracking from manufacturer to consumer
- Real-time verification through QR code scanning
- Decentralized trust without relying on centralized authorities

### **Multi-Stakeholder Platform**
- **Manufacturers**: Register and track medicine batches
- **Distributors**: Manage shipments and transport logs
- **Pharmacists**: Verify inventory and manage stock
- **Regulators**: Monitor compliance and generate reports
- **Consumers**: Instantly verify medicine authenticity

## Key Features

### **Instant Verification**
- **QR Code Scanning**: Point camera at medicine packaging to verify authenticity
- **Real-time Results**: Get verification status in seconds
- **Detailed Provenance**: View complete supply chain journey
- **Offline Support**: Cached verification data for areas with poor connectivity

### **Supply Chain Management**
- **Batch Registration**: Manufacturers register new medicine batches on blockchain
- **Transport Tracking**: Real-time location and condition monitoring
- **Inventory Management**: Track stock levels and expiry dates
- **Incident Reporting**: Report and track quality issues

### **Analytics & Reporting**
- **Compliance Monitoring**: Track regulatory compliance across supply chain
- **Quality Metrics**: Monitor batch quality and incident rates
- **Market Intelligence**: Identify counterfeit hotspots and trends
- **Audit Trails**: Complete immutable history of all transactions

### **Role-Based Access**
- **Personalized Dashboards**: Tailored interface for each user type
- **Permission Management**: Secure access controls for sensitive operations
- **Multi-language Support**: Accessible to global users
- **Responsive Design**: Optimized for mobile and tablet devices

## Core Functionalities

### **For Consumers**
- **Medicine Verification**: Scan QR codes to verify authenticity
- **Safety Alerts**: Receive notifications about recalled or dangerous medicines
- **Pharmacy Finder**: Locate verified pharmacies nearby
- **Health Records**: Track verified medicine purchases

### **For Manufacturers**
- **Batch Registration**: Register new medicine batches on blockchain
- **Quality Control**: Monitor production quality and compliance
- **Distribution Tracking**: Track products through supply chain
- **Regulatory Reporting**: Generate compliance reports for authorities

### **For Distributors**
- **Shipment Management**: Track and manage medicine shipments
- **Temperature Monitoring**: Ensure cold chain compliance
- **Inventory Optimization**: Manage stock levels and reduce waste
- **Route Optimization**: Optimize delivery routes and schedules

### **For Pharmacists**
- **Inventory Verification**: Verify authenticity of received medicines
- **Stock Management**: Track inventory levels and expiry dates
- **Patient Safety**: Ensure only authentic medicines reach patients
- **Regulatory Compliance**: Maintain compliance with local regulations

### **For Regulators**
- **Market Surveillance**: Monitor medicine quality across markets
- **Compliance Monitoring**: Track regulatory compliance
- **Investigation Tools**: Investigate counterfeit medicine reports
- **Policy Analytics**: Data-driven insights for policy making

## Impact & Benefits

### **Public Health Impact**
- **Reduced Deaths**: Prevent deaths from counterfeit medicines
- **Improved Trust**: Restore confidence in pharmaceutical systems
- **Better Access**: Ensure access to quality medicines in underserved areas
- **Health Equity**: Reduce health disparities caused by fake medicines

### **Economic Benefits**
- **Cost Savings**: Reduce healthcare costs from treating fake medicine effects
- **Market Protection**: Protect legitimate pharmaceutical companies
- **Supply Chain Efficiency**: Optimize logistics and reduce waste
- **Insurance Benefits**: Lower insurance costs through reduced claims

### **Regulatory Advantages**
- **Enhanced Oversight**: Real-time monitoring of pharmaceutical markets
- **Faster Response**: Quick identification and response to quality issues
- **Evidence-Based Policy**: Data-driven regulatory decision making
- **International Cooperation**: Facilitate cross-border regulatory collaboration

## Technical Architecture

### **Frontend (React Native/Expo)**
- **Cross-platform**: Single codebase for iOS and Android
- **Modern UI**: Beautiful, intuitive interface with Material Design
- **Offline-first**: Works without internet connectivity
- **Real-time Updates**: Live data synchronization

### **Blockchain Integration**
- **Ethereum Network**: Immutable record storage
- **Smart Contracts**: Automated verification and compliance
- **IPFS Storage**: Decentralized metadata storage
- **Web3 Integration**: Direct blockchain interaction

### **Security Features**
- **End-to-end Encryption**: Secure data transmission
- **Multi-factor Authentication**: Enhanced user security
- **Role-based Permissions**: Granular access controls
- **Audit Logging**: Complete activity tracking

## Getting Started

### **Prerequisites**
- Node.js 18+ and npm
- Expo CLI
- iOS Simulator or Android Emulator
- Python 3.6+ (for QR code generation)

### **Installation**

1. **Clone and install dependencies:**
   ```bash
   git clone <repository-url>
   cd meditrack
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm start
   # or
   npx expo start --port 8088
   ```

3. **Run on device:**
   ```bash
   # iOS
   npm run ios
   
   # Android
   npm run android
   
   # Web
   npm run web
   ```

### **QR Code Testing**

Generate test QR codes for verification:

```bash
# Quick setup (Linux/macOS)
./generate_qr.sh

# Manual setup
pip install -r requirements.txt
python generate_qr.py
```

This creates test QR codes in `qr_codes/` directory for scanning with the app.

## Project Structure

```
meditrack/
├── app/                    # Main application code
│   ├── (tabs)/            # Tab navigation screens
│   ├── components/        # Reusable UI components
│   ├── context/           # React context providers
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utility libraries
│   ├── navigation/        # Navigation configuration
│   ├── screens/           # Screen components
│   │   ├── consumer/      # Consumer-specific screens
│   │   ├── distributor/   # Distributor-specific screens
│   │   ├── manufacturer/  # Manufacturer-specific screens
│   │   ├── pharmacist/    # Pharmacist-specific screens
│   │   └── regulator/     # Regulator-specific screens
│   └── services/          # API and blockchain services
├── assets/                # Static assets (images, fonts)
├── components/            # Shared components
├── constants/             # App constants and configuration
├── utils/                 # Utility functions
├── qr_codes/             # Generated QR codes for testing
└── scripts/              # Build and deployment scripts
```

## Configuration

### **Environment Setup**
Create `.env` file with required configuration:
```env
EXPO_PUBLIC_API_URL=your_api_url
EXPO_PUBLIC_BLOCKCHAIN_NETWORK=ethereum_mainnet
EXPO_PUBLIC_IPFS_GATEWAY=your_ipfs_gateway
```

### **Blockchain Configuration**
Configure blockchain settings in `app/lib/blockchain.ts`:
- Network selection (mainnet/testnet)
- Smart contract addresses
- Gas price settings

## Testing

### **Unit Tests**
```bash
npm test
```

### **E2E Testing**
```bash
npm run test:e2e
```

### **QR Code Testing**
1. Generate test QR codes: `python generate_qr.py`
2. Open app and scan generated codes
3. Verify authentication results

## Documentation

- **[Installation Guide](INSTALL_GUIDE.md)** - Detailed setup instructions
- **[QR Generator Guide](QR_GENERATOR_README.md)** - QR code testing setup
- **[Loading Components](LOADING_COMPONENTS_README.md)** - UI component documentation
- **[API Documentation](docs/api.md)** - Backend API reference
- **[Blockchain Integration](docs/blockchain.md)** - Smart contract documentation

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### **Development Workflow**
1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- **Documentation**: Check our comprehensive guides
- **Issues**: Report bugs on GitHub Issues
- **Community**: Join our Discord community
- **Email**: support@meditrack.app

## Acknowledgments

- **World Health Organization** for counterfeit medicine statistics
- **Ethereum Foundation** for blockchain infrastructure
- **Expo Team** for excellent React Native tooling
- **Open Source Community** for amazing libraries and tools

---

**MediTrack: Securing Global Health Through Blockchain Technology**
