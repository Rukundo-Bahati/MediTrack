const { ethers } = require("hardhat");

async function main() {
  console.log(" Starting MediTrack contract deployment...");

  // Get the contract factory
  const MediTrack = await ethers.getContractFactory("MediTrack");

  // Deploy the contract
  console.log(" Deploying MediTrack contract...");
  const mediTrack = await MediTrack.deploy();

  await mediTrack.deployed();

  console.log("MediTrack contract deployed successfully!");
  console.log("Contract address:", mediTrack.address);
  console.log("Transaction hash:", mediTrack.deployTransaction.hash);

  // Wait for a few block confirmations
  console.log("Waiting for block confirmations...");
  await mediTrack.deployTransaction.wait(2);

  console.log(" Deployment completed!");
  
  // Save deployment info
  const deploymentInfo = {
    contractAddress: mediTrack.address,
    transactionHash: mediTrack.deployTransaction.hash,
    network: network.name,
    deployedAt: new Date().toISOString(),
    blockNumber: mediTrack.deployTransaction.blockNumber
  };

  console.log("\nDeployment Summary:");
  console.log(JSON.stringify(deploymentInfo, null, 2));

  // Register some test users for demonstration
  console.log("\nRegistering test users...");
  
  const [deployer, manufacturer, distributor, pharmacist, regulator] = await ethers.getSigners();
  
  // Register manufacturer
  await mediTrack.registerUser(
    manufacturer.address,
    0, // MANUFACTURER
    "PharmaCorp Ltd",
    "MFG-001"
  );
  console.log("Registered manufacturer:", manufacturer.address);

  // Register distributor
  await mediTrack.registerUser(
    distributor.address,
    1, // DISTRIBUTOR
    "MediDistrib Inc",
    "DIST-001"
  );
  console.log("Registered distributor:", distributor.address);

  // Register pharmacist
  await mediTrack.registerUser(
    pharmacist.address,
    2, // PHARMACIST
    "City Pharmacy",
    "PHARM-001"
  );
  console.log("Registered pharmacist:", pharmacist.address);

  // Register regulator
  await mediTrack.registerUser(
    regulator.address,
    3, // REGULATOR
    "Health Authority",
    "REG-001"
  );
  console.log("Registered regulator:", regulator.address);

  console.log("\nReady for testing!");
  console.log("Use this contract address in your React Native app:", mediTrack.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Deployment failed:", error);
    process.exit(1);
  });