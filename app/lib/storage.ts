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

// Fallback in-memory storage
let fallbackStorage: RegistrationData[] = [];

export async function getRegistrations(): Promise<{ data: RegistrationData[], method: string }> {
  const kvConfigured = process.env.KV_URL && process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN;
  
  if (kvConfigured) {
    try {
      const existingData = await kv.get('registrations');
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
      await kv.set('registrations', JSON.stringify(registrations));
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

export async function addRegistration(registration: RegistrationData): Promise<{ success: boolean, method: string }> {
  const { data: existingRegistrations } = await getRegistrations();
  const updatedRegistrations = [...existingRegistrations, registration];
  return await saveRegistrations(updatedRegistrations);
}
