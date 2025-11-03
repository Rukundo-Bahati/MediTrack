import { formatTimestamp, getBatchEvents } from './ether';
import { cacheTransportLogs, cacheVerification, getCachedTransportLogs, getCachedVerification } from './syncQue';

export async function verifyQR(qr: string) {
  // quick mock: decode QR string to batchId if it contains 'batch:' else random
  const batchId = qr.includes('batch:') ? qr.split('batch:')[1] : qr;

  // Try cached result first
  const cached = await getCachedVerification(batchId);
  if (cached) {
    console.log('Using cached verification for', batchId);
    return cached;
  }

  // simulate network latency (fast path ~500ms)
  await new Promise((r) => setTimeout(r, 600));

  // sample dataset - in a real app we'd call backend and ethers.js
  const isFake = batchId && batchId.toLowerCase().includes('fake');

  // Get on-chain events
  const chainEvents = await getBatchEvents(batchId);

  const result = {
    batchId,
    authentic: !isFake,
    expiry: '2026-12-31',
    drugName: 'Amoxicillin 500mg',
    lot: 'LOT-12345',
    manufacturer: 'GoodPharma Ltd',
    metadataURI: 'ipfs://QmMockCid',
    provenance: [
      { event: 'BatchRegistered', block: 123456, by: '0xManufacturer', timestamp: Date.now() - 1000 * 60 * 60 * 24 * 30 },
      { event: 'Shipped', location: 'Warehouse A', timestamp: Date.now() - 1000 * 60 * 60 * 24 * 20 },
      { event: 'Received', location: 'Distributor Hub', timestamp: Date.now() - 1000 * 60 * 60 * 24 * 10 },
    ],
    chainEvents: chainEvents.map((e) => ({
      ...e,
      formattedTime: formatTimestamp(e.timestamp),
    })),
    onChain: chainEvents.length > 0,
  };

  // Cache for offline access
  await cacheVerification(batchId, result);

  return result;
}

export async function registerBatch(data: any) {
  // simulate register -> compute hash
  await new Promise((r) => setTimeout(r, 800));
  console.log('Registering batch with data:', data);
  return { txHash: '0xMOCKTXHASH', batchId: `batch:${Math.random().toString(36).slice(2, 9)}` };
}

export async function appendTransport(batchId: string, log: any) {
  // Simulate appending transport log to batch on chain
  await new Promise((r) => setTimeout(r, 300));

  // Get existing logs and append
  const existingLogs = (await getCachedTransportLogs(batchId)) || [];
  const newLog = {
    id: `log_${Date.now()}`,
    timestamp: Date.now(),
    ...log,
  };
  const allLogs = [...existingLogs, newLog];

  // Cache updated logs
  await cacheTransportLogs(batchId, allLogs);

  return { success: true, appended: newLog, allLogs };
}