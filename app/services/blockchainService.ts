// Mock blockchain service for demonstration
export interface BatchVerificationResult {
  batchId: string;
  authentic: boolean;
  manufacturer: string;
  productName: string;
  expiryDate: string;
  verificationTimestamp: string;
  supplyChain: Array<{
    stage: string;
    location: string;
    timestamp: string;
    verified: boolean;
  }>;
}

export const verifyBatch = async (batchId: string): Promise<BatchVerificationResult> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Mock verification result
  return {
    batchId,
    authentic: Math.random() > 0.1, // 90% authentic rate
    manufacturer: 'PharmaCorp Ltd.',
    productName: 'Paracetamol 500mg',
    expiryDate: '2026-12-31',
    verificationTimestamp: new Date().toISOString(),
    supplyChain: [
      {
        stage: 'Manufacturing',
        location: 'Mumbai, India',
        timestamp: '2024-01-15T10:00:00Z',
        verified: true,
      },
      {
        stage: 'Distribution',
        location: 'Delhi, India',
        timestamp: '2024-01-20T14:30:00Z',
        verified: true,
      },
      {
        stage: 'Retail',
        location: 'Local Pharmacy',
        timestamp: '2024-01-25T09:15:00Z',
        verified: true,
      },
    ],
  };
};

// Mock batch data
export interface Batch {
  batchId: string;
  drugName: string;
  lotNumber: string;
  manufacturerName: string;
  quantity: number;
  expiryDate: string;
  status: 'active' | 'expired' | 'recalled';
}

export const getAllBatches = (): Batch[] => {
  return [
    {
      batchId: 'BATCH-2025-001',
      drugName: 'Paracetamol 500mg',
      lotNumber: 'LOT-001-2025',
      manufacturerName: 'PharmaCorp Ltd.',
      quantity: 10000,
      expiryDate: '2026-12-31',
      status: 'active',
    },
    {
      batchId: 'BATCH-2025-002',
      drugName: 'Ibuprofen 200mg',
      lotNumber: 'LOT-002-2025',
      manufacturerName: 'MediCorp Inc.',
      quantity: 5000,
      expiryDate: '2026-06-30',
      status: 'active',
    },
    {
      batchId: 'BATCH-2024-089',
      drugName: 'Aspirin 100mg',
      lotNumber: 'LOT-089-2024',
      manufacturerName: 'HealthPharma',
      quantity: 2500,
      expiryDate: '2025-03-15',
      status: 'expired',
    },
  ];
};

// Mock report data
export interface Report {
  id: string;
  batchId: string;
  reason: string;
  status: 'pending' | 'investigating' | 'resolved';
  createdAt: string;
  location?: string;
}

export const getAllReports = (): Report[] => {
  return [
    {
      id: 'RPT-001',
      batchId: 'BATCH-2024-087',
      reason: 'Suspicious packaging quality and color variations detected',
      status: 'investigating',
      createdAt: '2025-01-15T10:30:00Z',
      location: 'Lagos, Nigeria',
    },
    {
      id: 'RPT-002',
      batchId: 'BATCH-2024-092',
      reason: 'QR code verification failed multiple times',
      status: 'pending',
      createdAt: '2025-01-20T14:15:00Z',
      location: 'Nairobi, Kenya',
    },
    {
      id: 'RPT-003',
      batchId: 'BATCH-2024-078',
      reason: 'Counterfeit medicine confirmed by laboratory analysis',
      status: 'resolved',
      createdAt: '2025-01-10T09:45:00Z',
      location: 'Mumbai, India',
    },
  ];
};