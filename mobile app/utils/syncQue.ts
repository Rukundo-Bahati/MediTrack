import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

export type PendingOperation = {
  id: string;
  type: 'appendTransport' | 'verify' | 'report';
  batchId: string;
  payload: any;
  timestamp: number;
  synced?: boolean;
};

const QUEUE_KEY = 'medi_sync_queue';
const CACHE_KEY = 'medi_cache';

// Store a pending operation locally
export async function addToSyncQueue(op: Omit<PendingOperation, 'id' | 'timestamp'>) {
  try {
    const queue = await getSyncQueue();
    const newOp: PendingOperation = {
      ...op,
      id: `${op.type}_${Date.now()}_${Math.random()}`,
      timestamp: Date.now(),
    };
    queue.push(newOp);
    await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
    return newOp;
  } catch (e) {
    console.warn('addToSyncQueue error', e);
    return null;
  }
}

// Get all pending operations
export async function getSyncQueue(): Promise<PendingOperation[]> {
  try {
    const raw = await AsyncStorage.getItem(QUEUE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.warn('getSyncQueue error', e);
    return [];
  }
}

// Mark operation as synced and remove from queue
export async function markSynced(opId: string) {
  try {
    const queue = await getSyncQueue();
    const updated = queue.filter((op) => op.id !== opId);
    await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn('markSynced error', e);
  }
}

// Clear entire sync queue (for testing)
export async function clearSyncQueue() {
  try {
    await AsyncStorage.removeItem(QUEUE_KEY);
  } catch (e) {
    console.warn('clearSyncQueue error', e);
  }
}

// Cache a verification result for offline access
export async function cacheVerification(batchId: string, result: any) {
  try {
    const cache = await getCache();
    cache.verifications = cache.verifications || {};
    cache.verifications[batchId] = {
      ...result,
      cachedAt: Date.now(),
    };
    await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch (e) {
    console.warn('cacheVerification error', e);
  }
}

// Retrieve cached verification
export async function getCachedVerification(batchId: string) {
  try {
    const cache = await getCache();
    return cache.verifications?.[batchId] || null;
  } catch (e) {
    console.warn('getCachedVerification error', e);
    return null;
  }
}

// Cache transport logs for a batch
export async function cacheTransportLogs(batchId: string, logs: any[]) {
  try {
    const cache = await getCache();
    cache.transportLogs = cache.transportLogs || {};
    cache.transportLogs[batchId] = {
      logs,
      cachedAt: Date.now(),
    };
    await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch (e) {
    console.warn('cacheTransportLogs error', e);
  }
}

// Retrieve cached transport logs
export async function getCachedTransportLogs(batchId: string) {
  try {
    const cache = await getCache();
    return cache.transportLogs?.[batchId]?.logs || null;
  } catch (e) {
    console.warn('getCachedTransportLogs error', e);
    return null;
  }
}

// Get entire cache object
async function getCache() {
  try {
    const raw = await AsyncStorage.getItem(CACHE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    console.warn('getCache error', e);
    return {};
  }
}

// Sync pending operations when connection is restored
export async function syncOfflineQueue(syncFn: (op: PendingOperation) => Promise<any>) {
  try {
    const state = await NetInfo.fetch();
    if (!state.isConnected) {
      console.log('Device offline, skipping sync');
      return;
    }

    const queue = await getSyncQueue();
    const unsynced = queue.filter((op) => !op.synced);

    for (const op of unsynced) {
      try {
        await syncFn(op);
        await markSynced(op.id);
      } catch (e: any) {
        console.warn(`Failed to sync operation ${op.id}:`, e);
      }
    }
  } catch (e) {
    console.warn('syncOfflineQueue error', e);
  }
}

// Clear entire cache (for testing or logout)
export async function clearCache() {
  try {
    await AsyncStorage.removeItem(CACHE_KEY);
  } catch (e) {
    console.warn('clearCache error', e);
  }
}