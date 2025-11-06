// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title MediTrack
 * @dev Smart contract for pharmaceutical supply chain tracking
 * @notice This contract manages medicine batch registration and verification
 * @author MediTrack Team
 */
contract MediTrack {
    
    // Events
    event BatchRegistered(
        string indexed batchId,
        address indexed manufacturer,
        string drugName,
        uint256 timestamp
    );
    
    event BatchTransferred(
        string indexed batchId,
        address indexed from,
        address indexed to,
        uint256 timestamp
    );
    
    event BatchVerified(
        string indexed batchId,
        address indexed verifier,
        uint256 timestamp
    );
    
    event BatchRecalled(
        string indexed batchId,
        string reason,
        uint256 timestamp
    );
    
    // Enums
    enum UserRole { MANUFACTURER, DISTRIBUTOR, PHARMACIST, REGULATOR }
    enum BatchStatus { ACTIVE, SHIPPED, DELIVERED, RECALLED, EXPIRED }
    
    // Structs
    struct User {
        address userAddress;
        UserRole role;
        string name;
        string licenseNumber;
        bool isActive;
        uint256 registeredAt;
    }
    
    struct Batch {
        string batchId;
        string drugName;
        string activeIngredient;
        string dosage;
        address manufacturer;
        uint256 manufacturingDate;
        uint256 expiryDate;
        BatchStatus status;
        string ipfsHash;
        bool exists;
        uint256 createdAt;
    }
    
    struct SupplyChainEntry {
        address actor;
        UserRole actorRole;
        uint256 timestamp;
        string location;
        string action;
        string notes;
    }
    
    // State variables
    address public owner;
    uint256 private _batchCounter;
    bool private _locked;
    
    mapping(address => User) public users;
    mapping(string => Batch) public batches;
    mapping(string => SupplyChainEntry[]) public supplyChain;
    mapping(address => string[]) public userBatches;
    mapping(string => bool) public recalledBatches;
    
    address[] public registeredUsers;
    string[] public allBatchIds;
    
    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    
    modifier nonReentrant() {
        require(!_locked, "ReentrancyGuard: reentrant call");
        _locked = true;
        _;
        _locked = false;
    }
    
    modifier onlyRegisteredUser() {
        require(users[msg.sender].isActive, "User not registered or inactive");
        _;
    }
    
    modifier onlyRole(UserRole _role) {
        require(users[msg.sender].role == _role, "Unauthorized role");
        _;
    }
    
    modifier batchExists(string memory _batchId) {
        require(batches[_batchId].exists, "Batch does not exist");
        _;
    }
    
    modifier notRecalled(string memory _batchId) {
        require(!recalledBatches[_batchId], "Batch has been recalled");
        _;
    }
    
    // Constructor
    constructor() {
        owner = msg.sender;
        
        // Register the deployer as a regulator
        users[msg.sender] = User({
            userAddress: msg.sender,
            role: UserRole.REGULATOR,
            name: "Contract Owner",
            licenseNumber: "OWNER-001",
            isActive: true,
            registeredAt: block.timestamp
        });
        
        registeredUsers.push(msg.sender);
    }
    
    /**
     * @dev Register a new user in the system
     * @param _userAddress Address of the user
     * @param _role Role of the user
     * @param _name Name of the user/company
     * @param _licenseNumber License number
     */
    function registerUser(
        address _userAddress,
        UserRole _role,
        string memory _name,
        string memory _licenseNumber
    ) external onlyOwner {
        require(!users[_userAddress].isActive, "User already registered");
        
        users[_userAddress] = User({
            userAddress: _userAddress,
            role: _role,
            name: _name,
            licenseNumber: _licenseNumber,
            isActive: true,
            registeredAt: block.timestamp
        });
        
        registeredUsers.push(_userAddress);
    }
    
    /**
     * @dev Register a new medicine batch
     * @param _batchId Unique batch identifier
     * @param _drugName Name of the drug
     * @param _activeIngredient Active ingredient
     * @param _dosage Dosage information
     * @param _expiryDate Expiry date (timestamp)
     * @param _ipfsHash IPFS hash for additional metadata
     */
    function registerBatch(
        string memory _batchId,
        string memory _drugName,
        string memory _activeIngredient,
        string memory _dosage,
        uint256 _expiryDate,
        string memory _ipfsHash
    ) external onlyRegisteredUser onlyRole(UserRole.MANUFACTURER) nonReentrant {
        require(!batches[_batchId].exists, "Batch already exists");
        require(_expiryDate > block.timestamp, "Expiry date must be in the future");
        require(bytes(_batchId).length > 0, "Batch ID cannot be empty");
        
        batches[_batchId] = Batch({
            batchId: _batchId,
            drugName: _drugName,
            activeIngredient: _activeIngredient,
            dosage: _dosage,
            manufacturer: msg.sender,
            manufacturingDate: block.timestamp,
            expiryDate: _expiryDate,
            status: BatchStatus.ACTIVE,
            ipfsHash: _ipfsHash,
            exists: true,
            createdAt: block.timestamp
        });
        
        // Add to supply chain
        supplyChain[_batchId].push(SupplyChainEntry({
            actor: msg.sender,
            actorRole: UserRole.MANUFACTURER,
            timestamp: block.timestamp,
            location: "",
            action: "manufactured",
            notes: "Batch manufactured and registered on blockchain"
        }));
        
        userBatches[msg.sender].push(_batchId);
        allBatchIds.push(_batchId);
        _batchCounter++;
        
        emit BatchRegistered(_batchId, msg.sender, _drugName, block.timestamp);
    }
    
    /**
     * @dev Transfer batch to another party in the supply chain
     * @param _batchId Batch identifier
     * @param _to Address of the recipient
     * @param _location Current location
     * @param _notes Additional notes
     */
    function transferBatch(
        string memory _batchId,
        address _to,
        string memory _location,
        string memory _notes
    ) external onlyRegisteredUser batchExists(_batchId) notRecalled(_batchId) {
        require(users[_to].isActive, "Recipient not registered");
        require(msg.sender != _to, "Cannot transfer to self");
        
        Batch storage batch = batches[_batchId];
        require(block.timestamp < batch.expiryDate, "Batch has expired");
        
        // Update batch status based on recipient role
        if (users[_to].role == UserRole.DISTRIBUTOR) {
            batch.status = BatchStatus.SHIPPED;
        } else if (users[_to].role == UserRole.PHARMACIST) {
            batch.status = BatchStatus.DELIVERED;
        }
        
        // Add to supply chain
        supplyChain[_batchId].push(SupplyChainEntry({
            actor: _to,
            actorRole: users[_to].role,
            timestamp: block.timestamp,
            location: _location,
            action: "received",
            notes: _notes
        }));
        
        userBatches[_to].push(_batchId);
        
        emit BatchTransferred(_batchId, msg.sender, _to, block.timestamp);
    }
    
    /**
     * @dev Verify a batch (can be called by anyone for public verification)
     * @param _batchId Batch identifier
     * @return isValid Whether the batch is valid
     * @return batchData The batch information
     */
    function verifyBatch(string memory _batchId) 
        external 
        view 
        returns (bool isValid, Batch memory batchData) 
    {
        if (!batches[_batchId].exists) {
            return (false, Batch({
                batchId: "",
                drugName: "",
                activeIngredient: "",
                dosage: "",
                manufacturer: address(0),
                manufacturingDate: 0,
                expiryDate: 0,
                status: BatchStatus.ACTIVE,
                ipfsHash: "",
                exists: false,
                createdAt: 0
            }));
        }
        
        Batch memory batch = batches[_batchId];
        
        // Check if batch is valid
        bool valid = batch.exists && 
                    !recalledBatches[_batchId] && 
                    block.timestamp < batch.expiryDate;
        
        return (valid, batch);
    }
    
    /**
     * @dev Recall a batch (only by manufacturer or regulator)
     * @param _batchId Batch identifier
     * @param _reason Reason for recall
     */
    function recallBatch(
        string memory _batchId,
        string memory _reason
    ) external onlyRegisteredUser batchExists(_batchId) {
        Batch storage batch = batches[_batchId];
        
        require(
            msg.sender == batch.manufacturer || 
            users[msg.sender].role == UserRole.REGULATOR,
            "Only manufacturer or regulator can recall"
        );
        
        batch.status = BatchStatus.RECALLED;
        recalledBatches[_batchId] = true;
        
        // Add to supply chain
        supplyChain[_batchId].push(SupplyChainEntry({
            actor: msg.sender,
            actorRole: users[msg.sender].role,
            timestamp: block.timestamp,
            location: "",
            action: "recalled",
            notes: _reason
        }));
        
        emit BatchRecalled(_batchId, _reason, block.timestamp);
    }
    
    /**
     * @dev Get supply chain history for a batch
     * @param _batchId Batch identifier
     * @return Supply chain entries
     */
    function getSupplyChain(string memory _batchId) 
        external 
        view 
        batchExists(_batchId)
        returns (SupplyChainEntry[] memory) 
    {
        return supplyChain[_batchId];
    }
    
    /**
     * @dev Get all batches for a user
     * @param _user User address
     * @return Array of batch IDs
     */
    function getUserBatches(address _user) 
        external 
        view 
        returns (string[] memory) 
    {
        return userBatches[_user];
    }
    
    /**
     * @dev Get total number of registered batches
     * @return Total batch count
     */
    function getTotalBatches() external view returns (uint256) {
        return _batchCounter;
    }
    
    /**
     * @dev Get all batch IDs (for pagination in frontend)
     * @return Array of all batch IDs
     */
    function getAllBatchIds() external view returns (string[] memory) {
        return allBatchIds;
    }
    
    /**
     * @dev Get user information
     * @param _userAddress User address
     * @return User struct
     */
    function getUser(address _userAddress) 
        external 
        view 
        returns (User memory) 
    {
        return users[_userAddress];
    }
    
    /**
     * @dev Check if batch is expired
     * @param _batchId Batch identifier
     * @return Whether batch is expired
     */
    function isBatchExpired(string memory _batchId) 
        external 
        view 
        batchExists(_batchId)
        returns (bool) 
    {
        return block.timestamp >= batches[_batchId].expiryDate;
    }
    
    /**
     * @dev Get all registered users (only owner)
     * @return Array of user addresses
     */
    function getAllUsers() external view onlyOwner returns (address[] memory) {
        return registeredUsers;
    }
    
    /**
     * @dev Emergency function to deactivate a user (only owner)
     * @param _userAddress Address of user to deactivate
     */
    function deactivateUser(address _userAddress) external onlyOwner {
        require(users[_userAddress].isActive, "User not active");
        users[_userAddress].isActive = false;
    }
    
    /**
     * @dev Emergency function to reactivate a user (only owner)
     * @param _userAddress Address of user to reactivate
     */
    function reactivateUser(address _userAddress) external onlyOwner {
        require(!users[_userAddress].isActive, "User already active");
        users[_userAddress].isActive = true;
    }
    
    /**
     * @dev Transfer ownership to a new owner (only current owner)
     * @param _newOwner Address of the new owner
     */
    function transferOwnership(address _newOwner) external onlyOwner {
        require(_newOwner != address(0), "New owner cannot be zero address");
        require(_newOwner != owner, "New owner must be different");
        
        address oldOwner = owner;
        owner = _newOwner;
        
        // Register new owner as regulator if not already registered
        if (!users[_newOwner].isActive) {
            users[_newOwner] = User({
                userAddress: _newOwner,
                role: UserRole.REGULATOR,
                name: "New Contract Owner",
                licenseNumber: "OWNER-NEW",
                isActive: true,
                registeredAt: block.timestamp
            });
            registeredUsers.push(_newOwner);
        }
    }
}