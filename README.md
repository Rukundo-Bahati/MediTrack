# MediTrack

```
Protecting lives through blockchain technology
```

**Blockchain-Powered Medicine Verification System**

MediTrack is a comprehensive mobile application that leverages blockchain technology to combat counterfeit medicines and ensure pharmaceutical supply chain integrity. Built with React Native and Expo, it provides real-time verification of medicine authenticity through QR code scanning and immutable blockchain records.

# Core Mission
 Pharmaceutical supply chain transparency and anti-counterfeiting through blockchain technology

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
- **Real-time Results**: Get verification status in seconds with blockchain confirmation
- **Medicine Information Lookup**: Complete drug details, warnings, and side effects
- **Offline Support**: Cached verification data for areas with poor connectivity
- **Public Access**: No registration required for medicine verification

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
- **Medicine Verification**: Scan QR codes to verify authenticity instantly
- **Offline Verification**: Verify medicines even without internet connection
- **Medicine Information**: Complete drug information, warnings, and side effects
- **Blockchain Status**: See "Verified on Blockchain ✓" confirmation
- **Safety Alerts**: Identify counterfeit, expired, or recalled medicines

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

## Blockchain Integration

**FULLY INTEGRATED**: This app includes complete blockchain functionality using free testnets.

### Blockchain Features
- **Smart Contracts**: Solidity contracts for medicine batch tracking
- **Multi-Network Support**: Polygon Mumbai, Sepolia, BSC Testnet  
- **Free Verification**: All verification calls are free (read-only)
- **Offline Support**: Cached blockchain data for offline verification
- **Supply Chain Tracking**: Complete batch history on blockchain
- **Real-time Status**: Shows "Verified on Blockchain" for authentic medicines

### How Smart Contracts Power This App

#### **MediTrack Smart Contract Architecture**
The app uses custom-built Solidity smart contracts deployed on blockchain networks to ensure pharmaceutical supply chain integrity:

**Contract Files:**
- `contracts/MediTrack.sol` - Main production contract (self-contained, no external dependencies)
- `contracts/MediTrackSimple.sol` - Simplified version for educational purposes

#### **Core Smart Contract Functions**

**Public Verification (Free - No Gas Fees)**
```solidity
// Anyone can verify medicine authenticity for free
function verifyBatch(string batchId) 
    returns (bool isValid, Batch batchData)

// Get complete supply chain history
function getSupplyChain(string batchId) 
    returns (SupplyChainEntry[] memory)

// Check if medicine has expired
function isBatchExpired(string batchId) 
    returns (bool)
```

**Manufacturer Functions (Requires Gas)**
```solidity
// Register new medicine batch on blockchain
function registerBatch(
    string batchId,
    string drugName, 
    string activeIngredient,
    string dosage,
    uint256 expiryDate,
    string ipfsHash
)

// Emergency recall functionality
function recallBatch(string batchId, string reason)
```

**Supply Chain Functions (Requires Gas)**
```solidity
// Transfer batch to next party in supply chain
function transferBatch(
    string batchId,
    address to,
    string location,
    string notes
)
```

#### **How the App Uses Smart Contracts**

**1. Medicine Verification Flow**
```
User Scans QR Code → App calls verifyBatch() → Smart Contract Returns:
├── Batch exists and valid → "Verified on Blockchain ✓"
├── Batch expired → "EXPIRED - Do Not Use"
├── Batch recalled → "RECALLED - Do Not Use"  
└── Batch not found → "COUNTERFEIT - Do Not Use"
```

**2. Supply Chain Tracking**
```
Manufacturer → registerBatch() → Blockchain Record Created
     ↓
Distributor → transferBatch() → Ownership Transfer Logged
     ↓  
Pharmacy → transferBatch() → Final Delivery Recorded
     ↓
Consumer → verifyBatch() → Complete History Retrieved
```

**3. Real-time Integration**
- **React Native Service**: `app/services/blockchain.ts` connects to smart contracts
- **Automatic Caching**: Blockchain data cached locally for offline access
- **Multi-Network**: Supports Ethereum, Polygon, BSC testnets
- **Gas Optimization**: Verification calls are free (view functions)

#### **Smart Contract Security Features**

**Access Control**
- **Owner-only Functions**: Administrative functions restricted to contract owner
- **Role-based Permissions**: Different access levels for Manufacturers, Distributors, Pharmacists, Regulators
- **User Registration**: Only registered users can perform write operations

**Data Integrity**
- **Immutable Records**: Once written to blockchain, batch data cannot be altered
- **Input Validation**: All functions validate input data and check prerequisites
- **Reentrancy Protection**: Built-in protection against reentrancy attacks
- **Existence Checks**: Prevents operations on non-existent batches

**Supply Chain Security**
- **Provenance Tracking**: Complete audit trail from manufacturer to consumer
- **Transfer Validation**: Only authorized parties can transfer batches
- **Recall Management**: Emergency recall functionality for safety incidents
- **Expiry Enforcement**: Automatic expiry checking prevents expired medicine use

#### **Blockchain Networks Supported**

**Testnets (Free for Development)**
- **Polygon Mumbai**: Recommended - Fast, cheap, reliable
- **Ethereum Sepolia**: Ethereum-native testnet
- **BSC Testnet**: Binance Smart Chain testnet

**Mainnet Ready**
- Contracts are production-ready for mainnet deployment
- Gas-optimized for cost-effective operations
- Multi-network compatibility for global deployment

#### **Demo vs Production Mode**

**Demo Mode (Default)**
- Uses simulated blockchain data for instant testing
- No blockchain setup required
- Full functionality including "Verified on Blockchain" status
- Perfect for demonstrations and development

**Production Mode (Optional)**
- Deploy contracts to real blockchain networks
- Requires minimal setup (see [BLOCKCHAIN_SETUP.md](BLOCKCHAIN_SETUP.md))
- Real blockchain verification with immutable records
- Suitable for production pharmaceutical supply chains

### **Demo Mode**
The app works perfectly out-of-the-box with simulated blockchain data. For real blockchain deployment, see [BLOCKCHAIN_SETUP.md](BLOCKCHAIN_SETUP.md).

## MetaMask Integration & Stakeholder Roles

**MetaMask Wallet Integration**: MediTrack integrates with MetaMask to provide secure, decentralized identity and transaction signing for pharmaceutical supply chain participants.

### Core Role: Digital Identity & Authentication

MetaMask serves as the bridge between users and the blockchain, providing:
- **Digital Wallet**: Secure storage of private keys and blockchain credentials
- **Identity Provider**: Each wallet address represents a unique stakeholder in the supply chain
- **Transaction Signer**: Cryptographic signing of all blockchain transactions
- **Network Gateway**: Connection to multiple blockchain networks (Ethereum, Polygon, BSC)

### Stakeholder Roles in the Supply Chain

The MetaMask integration enables role-based access for different pharmaceutical stakeholders:

#### **Manufacturers** (Role 0)
**Wallet Functions:**
- **Batch Registration**: Register new medicine batches on blockchain with cryptographic proof
- **Quality Control**: Sign quality certificates and manufacturing records
- **Supply Chain Initiation**: Create initial blockchain record for new medicines
- **Regulatory Compliance**: Submit manufacturing data to regulatory smart contracts

**Example Workflow:**
```
Manufacturer Wallet (0x1234...) → Connect to MediTrack
→ Register Batch "PARA001" → Sign Transaction → Blockchain Record Created
→ Transfer to Distributor → Sign Transfer Transaction → Ownership Updated
```

#### **Distributors** (Role 1)
**Wallet Functions:**
- **Batch Reception**: Confirm receipt of medicine batches from manufacturers
- **Transport Tracking**: Sign location and condition updates during transport
- **Inventory Management**: Update stock levels and storage conditions
- **Chain of Custody**: Maintain cryptographic proof of possession

**Example Workflow:**
```
Distributor Wallet (0x5678...) → Receive Batch Transfer
→ Sign Receipt Confirmation → Update Location Data
→ Transfer to Pharmacy → Sign Final Transfer → Complete Chain
```

#### **Pharmacists** (Role 2)
**Wallet Functions:**
- **Final Verification**: Confirm receipt of authentic medicines
- **Dispensing Records**: Record medicine dispensing to patients
- **Inventory Tracking**: Manage pharmacy stock and expiry monitoring
- **Patient Safety**: Ensure only verified medicines reach consumers

**Example Workflow:**
```
Pharmacist Wallet (0x9abc...) → Receive from Distributor
→ Verify Batch Authenticity → Sign Receipt
→ Dispense to Patient → Update Blockchain Status
```

#### **Regulators** (Role 3)
**Wallet Functions:**
- **Market Surveillance**: Monitor pharmaceutical supply chains
- **Compliance Verification**: Verify regulatory compliance across stakeholders
- **Investigation Tools**: Access complete audit trails for investigations
- **Emergency Actions**: Execute recalls and safety alerts

**Example Workflow:**
```
Regulator Wallet (0xdef0...) → Access All Supply Chain Data
→ Verify Compliance → Generate Reports
→ Issue Recall (if needed) → Sign Emergency Action
```

### Key MetaMask Functions in MediTrack

#### **1. Secure Authentication**
```typescript
// Connect wallet to establish identity
const walletState = await walletService.connect();
// Returns: { address, chainId, balance, networkName }
```

#### **2. Transaction Signing**
```typescript
// Sign blockchain transactions for supply chain actions
const txHash = await walletService.signTransaction({
  to: contractAddress,
  data: batchRegistrationData,
  value: '0x0'
});
```

#### **3. Message Signing**
```typescript
// Sign messages for off-chain verification
const signature = await walletService.signMessage(
  `Verify batch ${batchId} for ${drugName}`
);
```

#### **4. Network Management**
```typescript
// Switch between different blockchain networks
await walletService.switchNetwork('mumbai'); // Polygon testnet
await walletService.switchNetwork('sepolia'); // Ethereum testnet
```

### Multi-Network Support

**Supported Blockchain Networks:**
- **Ethereum Mainnet**: Production deployment for high-value medicines
- **Polygon Mumbai**: Fast, low-cost transactions for testing and development
- **Sepolia Testnet**: Ethereum testnet for development and demonstrations
- **BSC Testnet**: Alternative low-cost network for global accessibility

### Security Features

#### **Role-Based Access Control**
```solidity
// Smart contract enforces wallet-based permissions
modifier onlyManufacturer() {
    require(stakeholders[msg.sender].role == StakeholderRole.MANUFACTURER);
    _;
}
```

#### **Cryptographic Verification**
- Every action requires wallet signature
- Immutable audit trail of all transactions
- Non-repudiation through blockchain records
- Multi-signature support for high-value operations

#### **Transaction Integrity**
- Gas estimation for cost prediction
- Transaction receipt verification
- Confirmation waiting with timeout handling
- Automatic retry mechanisms for failed transactions

### User Experience Modes

#### **Demo Mode** (No Wallet Required)
- Simulated blockchain interactions for demonstrations
- Full functionality without MetaMask installation
- Perfect for showcasing supply chain transparency
- No gas fees or real blockchain transactions

#### **Wallet Mode** (MetaMask Required)
- Real blockchain transactions with cryptographic security
- Actual gas fees (minimal on testnets)
- Permanent, immutable blockchain records
- Full decentralized trust model

### Integration Benefits

#### **Trust & Transparency**
- Cryptographically signed transactions eliminate fraud
- Immutable blockchain records prevent data manipulation
- Decentralized verification removes single points of failure
- Public auditability of entire supply chain

#### **Anti-Counterfeiting**
- Only authorized wallets can register medicine batches
- Counterfeit medicines cannot be added to the verified supply chain
- Real-time authenticity verification for consumers
- Automatic detection of unauthorized batch modifications

#### **Regulatory Compliance**
- Complete traceability from manufacturer to patient
- Automated compliance reporting with cryptographic proof
- Recall management with blockchain-verified execution
- Cross-border regulatory cooperation through standardized records

#### **Global Interoperability**
- Works across international borders and jurisdictions
- Standardized verification process for all stakeholders
- Multi-language support with consistent blockchain backend
- Seamless integration with existing pharmaceutical systems

### Future MetaMask Enhancements

**Planned Integrations:**
- **Hardware Wallet Support**: Integration with Ledger and Trezor devices
- **Multi-signature Transactions**: Require multiple approvals for critical operations
- **Biometric Authentication**: Enhanced security through biometric verification
- **Cross-chain Bridges**: Support for multiple blockchain networks simultaneously
- **Smart Contract Governance**: Stakeholder voting on protocol upgrades

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


## Future Development

**Comprehensive Feature Roadmap**: See our detailed [Future Features Implementation Plan](Features-to-be-Implemented-in-future.md) for upcoming enhancements including:
- Advanced AI-powered counterfeit detection
- IoT integration for real-time monitoring  
- Global regulatory compliance automation
- Enhanced security and blockchain features
- Healthcare system integrations
- And much more...

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
- **Email**: rukundorca@gmail.com

## Acknowledgments

- **World Health Organization** for counterfeit medicine statistics
- **Ethereum Foundation** for blockchain infrastructure
- **Expo Team** for excellent React Native tooling
- **Open Source Community** for amazing libraries and tools

---

**MediTrack: Securing Global Health Through Blockchain Technology**
