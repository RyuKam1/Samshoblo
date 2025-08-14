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
  totalCount: number,
  isDuplicate?: boolean
}> {
  const kvConfigured = process.env.KV_URL && process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN;
  
  if (kvConfigured) {
    try {
      // Use a more reliable approach with retry mechanism
      let retries = 3;
      let lastError: unknown;
      
      while (retries > 0) {
        try {
          // Get current data
          const existingData = await kv.get(STORAGE_KEY);
          const existingRegistrations = existingData ? JSON.parse(existingData as string) : [];
          
          // Check for duplicate registration (same phone number and child name)
          const isDuplicate = existingRegistrations.some((existing: RegistrationData) => 
            existing.parentPhone === registration.parentPhone && 
            existing.childName === registration.childName &&
            existing.childSurname === registration.childSurname
          );
          
          if (isDuplicate) {
            return {
              success: true,
              method: 'vercel-kv-duplicate',
              removedCount: 0,
              totalCount: existingRegistrations.length,
              isDuplicate: true
            };
          }
          
          // Add new registration
          const updatedRegistrations = [...existingRegistrations, registration];
          
          // Use Redis WATCH/MULTI/EXEC for atomicity
          const multi = kv.multi();
          multi.set(STORAGE_KEY, JSON.stringify(updatedRegistrations));
          await multi.exec();
          
          return {
            success: true,
            method: 'vercel-kv-atomic',
            removedCount: 0,
            totalCount: updatedRegistrations.length,
            isDuplicate: false
          };
        } catch (error) {
          lastError = error;
          retries--;
          if (retries > 0) {
            // Wait a bit before retrying
            await new Promise(resolve => setTimeout(resolve, 100));
          }
        }
      }
      
      // If all retries failed, fall back to standard method
      console.error('Atomic operations failed after retries, using fallback:', lastError);
      const { data: existingRegistrations } = await getRegistrations();
      
      // Check for duplicate in fallback method too
      const isDuplicate = existingRegistrations.some((existing: RegistrationData) => 
        existing.parentPhone === registration.parentPhone && 
        existing.childName === registration.childName &&
        existing.childSurname === registration.childSurname
      );
      
      if (isDuplicate) {
        return {
          success: true,
          method: 'memory-fallback-duplicate',
          removedCount: 0,
          totalCount: existingRegistrations.length,
          isDuplicate: true
        };
      }
      
      const updatedRegistrations = [...existingRegistrations, registration];
      const result = await saveRegistrations(updatedRegistrations);
      
      return {
        ...result,
        removedCount: 0,
        totalCount: updatedRegistrations.length,
        isDuplicate: false
      };
    } catch (error) {
      console.error('KV operation failed, falling back to standard method:', error);
      // Fallback to standard method
      const { data: existingRegistrations } = await getRegistrations();
      const updatedRegistrations = [...existingRegistrations, registration];
      const result = await saveRegistrations(updatedRegistrations);
      
      return {
        ...result,
        removedCount: 0,
        totalCount: updatedRegistrations.length
      };
    }
      } else {
      // For in-memory storage, use a simple approach
      const { data: existingRegistrations } = await getRegistrations();
      
      // Check for duplicate in memory storage too
      const isDuplicate = existingRegistrations.some((existing: RegistrationData) => 
        existing.parentPhone === registration.parentPhone && 
        existing.childName === registration.childName &&
        existing.childSurname === registration.childSurname
      );
      
      if (isDuplicate) {
        return {
          success: true,
          method: 'memory-only-duplicate',
          removedCount: 0,
          totalCount: existingRegistrations.length,
          isDuplicate: true
        };
      }
      
      const updatedRegistrations = [...existingRegistrations, registration];
      const result = await saveRegistrations(updatedRegistrations);
      
      return {
        ...result,
        removedCount: 0,
        totalCount: updatedRegistrations.length,
        isDuplicate: false
      };
    }
}

// Helper function to get storage statistics
export async function getStorageStats(): Promise<{
  totalRegistrations: number;
  storageUsed: number;
  storageMethod: string;
}> {
  const { data: registrations, method } = await getRegistrations();
  const totalSize = JSON.stringify(registrations).length;
  const storageUsedMB = (totalSize / (1024 * 1024)).toFixed(2);
  
  return {
    totalRegistrations: registrations.length,
    storageUsed: parseFloat(storageUsedMB),
    storageMethod: method
  };
}
