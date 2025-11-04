# MediTrack Smart Contracts

This folder contains the blockchain smart contracts for MediTrack's pharmaceutical supply chain tracking system.

## Contract Files

### MediTrack.sol (Recommended)
- **Full-featured** pharmaceutical supply chain contract
- **Self-contained** - no external dependencies
- **Production-ready** with all security features
- **Gas-optimized** for cost-effective deployment

### MediTrackSimple.sol (Alternative)
- **Simplified** version with core functionality
- **Minimal** gas usage for deployment
- **Educational** - easier to understand and modify

## Key Features

### Batch Management
- Register medicine batches on blockchain
- Track manufacturing and expiry dates
- Immutable batch records

### Supply Chain Tracking
- Complete provenance from manufacturer to consumer
- Role-based access (Manufacturer, Distributor, Pharmacist, Regulator)
- Transfer tracking with timestamps and locations

### Public Verification
- Anyone can verify batch authenticity
- Free verification calls (view functions)
- Counterfeit detection

### Recall Management
- Emergency batch recall functionality
- Manufacturer and regulator recall authority
- Automatic status updates

## Quick Start

### 1. Check Contracts
```bash
# Verify contracts have no external dependencies
node test-compile.js
```

### 2. Compile (Optional)
```bash
# Install Hardhat if you want to deploy
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox

# Compile contracts
npx hardhat compile
```

### 3. Deploy (Optional)
```bash
# Deploy to local network
npx hardhat run deploy.js --network hardhat

# Deploy to testnet (requires setup)
npx hardhat run deploy.js --network mumbai
```

## Contract Functions

### Public Functions (Free to Call)
- `verifyBatch(batchId)` - Verify batch authenticity
- `getSupplyChain(batchId)` - Get complete supply chain history
- `getUserBatches(address)` - Get all batches for a user
- `getTotalBatches()` - Get total number of registered batches
- `isBatchExpired(batchId)` - Check if batch is expired

### Manufacturer Functions
- `registerBatch()` - Register new medicine batch
- `recallBatch()` - Recall a batch (emergency)

### Supply Chain Functions
- `transferBatch()` - Transfer batch to next party
- `recallBatch()` - Recall batch (manufacturer/regulator only)

### Admin Functions (Owner Only)
- `registerUser()` - Register new users in the system
- `deactivateUser()` - Deactivate a user account

## Security Features

### Access Control
- Owner-only administrative functions
- Role-based permissions (Manufacturer, Distributor, Pharmacist, Regulator)
- User registration and activation system

### Reentrancy Protection
- Built-in reentrancy guard
- Safe state modifications
- Protected against common attacks

### Data Validation
- Input validation for all functions
- Batch existence checks
- Expiry date validation
- Duplicate prevention

## Gas Optimization

### Efficient Storage
- Optimized struct packing
- Minimal storage operations
- Batch operations where possible

### View Functions
- All verification calls are free
- No gas cost for reading data
- Public accessibility

## Network Compatibility

### Supported Networks
- **Ethereum** (Mainnet, Sepolia Testnet)
- **Polygon** (Mainnet, Mumbai Testnet) - Recommended
- **Binance Smart Chain** (Mainnet, Testnet)
- **Any EVM-compatible network**

### Deployment Costs
- **Polygon Mumbai**: ~$0.001 (Free with faucet tokens)
- **Sepolia**: ~$0.01 (Free with faucet tokens)
- **BSC Testnet**: ~$0.001 (Free with faucet tokens)

## Testing

### Test Batch IDs
```
PARA001  # Valid Paracetamol batch
AMOX002  # Valid Amoxicillin batch
IBU003   # Valid Ibuprofen batch
FAKE001  # Counterfeit medicine (will fail verification)
EXP001   # Expired medicine (will fail verification)
REC001   # Recalled medicine (will fail verification)
```

### Test Functions
```solidity
// Verify a batch
(bool isValid, Batch memory batch) = contract.verifyBatch("PARA001");

// Get supply chain
SupplyChainEntry[] memory chain = contract.getSupplyChain("PARA001");

// Check if expired
bool expired = contract.isBatchExpired("PARA001");
```

## License

MIT License - See [LICENSE](../LICENSE) file for details.

## Contributing

1. Fork the repository
2. Create your feature branch
3. Test your changes thoroughly
4. Submit a pull request

## Support

- **Documentation**: See [BLOCKCHAIN_SETUP.md](../BLOCKCHAIN_SETUP.md)
- **Issues**: Report on GitHub Issues
- **Email**: rukundorca@gmail.com

---

**Ready to secure the pharmaceutical supply chain with blockchain technology!**