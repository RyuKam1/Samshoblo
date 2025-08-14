import { kv } from '@vercel/kv';

export interface RegistrationData {
  childName: string;
  childSurname: string;
  childAge: string;
  parentName: string;
  parentSurname: string;
  parentPhone: string;
  timestamp: string;
  id: string;
}

// Configuration
const MAX_REGISTRATIONS = 1000; // Configurable limit - adjust based on your needs
const STORAGE_KEY = 'registrations';

// Fallback in-memory storage
let fallbackStorage: RegistrationData[] = [];

export async function getRegistrations(): Promise<{ data: RegistrationData[], method: string }> {
  const kvConfigured = process.env.KV_URL && process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN;
  
  if (kvConfigured) {
    try {
      const existingData = await kv.get(STORAGE_KEY);
      const data = existingData ? JSON.parse(existingData as string) : [];
      return { data, method: 'vercel-kv' };
    } catch (error) {
      console.error('Vercel KV failed, falling back to memory storage:', error);
      return { data: fallbackStorage, method: 'memory-fallback' };
    }
  } else {
    return { data: fallbackStorage, method: 'memory-only' };
  }
}

export async function saveRegistrations(registrations: RegistrationData[]): Promise<{ success: boolean, method: string }> {
  const kvConfigured = process.env.KV_URL && process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN;
  
  if (kvConfigured) {
    try {
      await kv.set(STORAGE_KEY, JSON.stringify(registrations));
      return { success: true, method: 'vercel-kv' };
    } catch (error) {
      console.error('Vercel KV failed, falling back to memory storage:', error);
      fallbackStorage = registrations;
      return { success: true, method: 'memory-fallback' };
    }
  } else {
    fallbackStorage = registrations;
    return { success: true, method: 'memory-only' };
  }
}

export async function addRegistration(registration: RegistrationData): Promise<{ 
  success: boolean, 
  method: string, 
  removedCount?: number,
  totalCount: number 
}> {
  const { data: existingRegistrations } = await getRegistrations();
  
  // Add new registration
  let updatedRegistrations = [...existingRegistrations, registration];
  let removedCount = 0;
  
  // Implement FIFO: Remove oldest registrations if limit exceeded
  if (updatedRegistrations.length > MAX_REGISTRATIONS) {
    const excessCount = updatedRegistrations.length - MAX_REGISTRATIONS;
    updatedRegistrations = updatedRegistrations.slice(excessCount); // Remove oldest entries
    removedCount = excessCount;
  }
  
  const result = await saveRegistrations(updatedRegistrations);
  
  return {
    ...result,
    removedCount,
    totalCount: updatedRegistrations.length
  };
}

// Helper function to get storage statistics
export async function getStorageStats(): Promise<{
  totalRegistrations: number;
  maxCapacity: number;
  storageUsed: number;
  storageMethod: string;
}> {
  const { data: registrations, method } = await getRegistrations();
  const totalSize = JSON.stringify(registrations).length;
  const storageUsedMB = (totalSize / (1024 * 1024)).toFixed(2);
  
  return {
    totalRegistrations: registrations.length,
    maxCapacity: MAX_REGISTRATIONS,
    storageUsed: parseFloat(storageUsedMB),
    storageMethod: method
  };
}
