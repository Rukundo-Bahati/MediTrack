// Ethers.js read-only provider setup for querying Ethereum blockchain
// Configured for Infura/Alchemy (mock keys replaced in production)

// Mock configuration - replace with actual keys in production
const INFURA_PROJECT_ID = 'demo-infura-key'; // Replace with real Infura project ID
const ALCHEMY_API_KEY = 'demo-alchemy-key'; // Replace with real Alchemy API key

// Simulated on-chain batch events (in real app, query from smart contract)
export interface BatchEvent {
  eventName: string;
  block: number;
  timestamp: number;
  transactionHash: string;
  by: string; // address
  details: any;
  formattedTime?: string;
}

// Mock implementation: simulate querying batch events from contract
export async function getBatchEvents(batchId: string): Promise<BatchEvent[]> {
  // Simulate network latency
  await new Promise((r) => setTimeout(r, 400));

  // Mock events for demo - in production, this would query a smart contract
  const mockEvents: BatchEvent[] = [
    {
      eventName: 'BatchRegistered',
      block: 18123456,
      timestamp: Date.now() - 1000 * 60 * 60 * 24 * 30,
      transactionHash: '0xabcd1234',
      by: '0xManufacturerAddress',
      details: {
        drugName: 'Amoxicillin 500mg',
        lot: 'LOT-12345',
        quantity: 5000,
        metadataURI: 'ipfs://QmMockCid',
      },
    },
    {
      eventName: 'TransportAppended',
      block: 18124000,
      timestamp: Date.now() - 1000 * 60 * 60 * 24 * 20,
      transactionHash: '0xefgh5678',
      by: '0xDistributorAddress',
      details: {
        location: 'Warehouse A, Lagos',
        status: 'In Transit',
        timestamp: Date.now() - 1000 * 60 * 60 * 24 * 20,
      },
    },
    {
      eventName: 'TransportAppended',
      block: 18125000,
      timestamp: Date.now() - 1000 * 60 * 60 * 24 * 10,
      transactionHash: '0xijkl9012',
      by: '0xDistributorAddress2',
      details: {
        location: 'Distributor Hub, Abuja',
        status: 'Received',
        timestamp: Date.now() - 1000 * 60 * 60 * 24 * 10,
      },
    },
  ];

  // Add formatted time to each event
  return mockEvents.map((e) => ({
    ...e,
    formattedTime: formatTimestamp(e.timestamp),
  }));
}

// Get batch status from chain
export async function getBatchStatus(batchId: string): Promise<{ status: string; onChain: boolean }> {
  try {
    const events = await getBatchEvents(batchId);
    const onChain = events.length > 0;
    const lastEvent = events[events.length - 1]?.eventName || 'Unknown';
    return { status: lastEvent, onChain };
  } catch (e) {
    console.warn('getBatchStatus error', e);
    return { status: 'Unknown', onChain: false };
  }
}

// Get formatted blockchain explorer link (Etherscan mock)
export function getEtherscanLink(txHash: string, network: string = 'mainnet'): string {
  const baseUrl = network === 'mainnet' ? 'https://etherscan.io' : 'https://sepolia.etherscan.io';
  return `${baseUrl}/tx/${txHash}`;
}

// Get provider URL (for direct HTTP calls if needed)
export function getInfuraUrl(): string {
  return `https://mainnet.infura.io/v3/${INFURA_PROJECT_ID}`;
}

export function getAlchemyUrl(): string {
  return `https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`;
}

// Verify batch on-chain (mock: check if batch exists in mock events)
export async function verifyBatchOnChain(batchId: string): Promise<boolean> {
  const events = await getBatchEvents(batchId);
  return events.length > 0 && events.some((e) => e.eventName === 'BatchRegistered');
}

// Format block timestamp to readable date
export function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}