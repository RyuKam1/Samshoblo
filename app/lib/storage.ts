import { supabase, REGISTRATIONS_TABLE } from './supabase';

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

export async function getRegistrations(): Promise<{ data: RegistrationData[], method: string }> {
  try {
    const { data, error } = await supabase
      .from(REGISTRATIONS_TABLE)
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase query error:', error);
      return { data: [], method: 'supabase-error' };
    }

    // Transform database format to application format
    const transformedData: RegistrationData[] = (data || []).map(row => ({
      childName: row.child_name,
      childSurname: row.child_surname,
      childAge: row.child_age,
      parentName: row.parent_name,
      parentSurname: row.parent_surname,
      parentPhone: row.parent_phone,
      timestamp: row.timestamp,
      id: row.id
    }));

    return { data: transformedData, method: 'supabase' };
  } catch (error) {
    console.error('Supabase operation failed:', error);
    return { data: [], method: 'supabase-error' };
  }
}

export async function saveRegistrations(registrations: RegistrationData[]): Promise<{ success: boolean, method: string }> {
  try {
    // Transform application format to database format
    const dbData = registrations.map(reg => ({
      id: reg.id,
      child_name: reg.childName,
      child_surname: reg.childSurname,
      child_age: reg.childAge,
      parent_name: reg.parentName,
      parent_surname: reg.parentSurname,
      parent_phone: reg.parentPhone,
      timestamp: reg.timestamp
    }));

    // First, delete all existing records
    const { error: deleteError } = await supabase
      .from(REGISTRATIONS_TABLE)
      .delete()
      .neq('id', ''); // Delete all records

    if (deleteError) {
      console.error('Error deleting existing records:', deleteError);
      return { success: false, method: 'supabase-delete-error' };
    }

    // Then insert all records
    const { error: insertError } = await supabase
      .from(REGISTRATIONS_TABLE)
      .insert(dbData);

    if (insertError) {
      console.error('Error inserting records:', insertError);
      return { success: false, method: 'supabase-insert-error' };
    }

    return { success: true, method: 'supabase' };
  } catch (error) {
    console.error('Supabase save operation failed:', error);
    return { success: false, method: 'supabase-error' };
  }
}

export async function addRegistration(registration: RegistrationData): Promise<{ 
  success: boolean, 
  method: string, 
  removedCount?: number,
  totalCount: number,
  isDuplicate?: boolean
}> {
  try {
    // Check for duplicate registration (same phone number and child name)
    const { data: existingData, error: queryError } = await supabase
      .from(REGISTRATIONS_TABLE)
      .select('*')
      .eq('parent_phone', registration.parentPhone)
      .eq('child_name', registration.childName)
      .eq('child_surname', registration.childSurname);

    if (queryError) {
      console.error('Error checking for duplicates:', queryError);
      return { 
        success: false, 
        method: 'supabase-query-error',
        removedCount: 0,
        totalCount: 0
      };
    }

    if (existingData && existingData.length > 0) {
      // Get total count for response
      const { count } = await supabase
        .from(REGISTRATIONS_TABLE)
        .select('*', { count: 'exact', head: true });

      return {
        success: true,
        method: 'supabase-duplicate',
        removedCount: 0,
        totalCount: count || 0,
        isDuplicate: true
      };
    }

    // Transform to database format
    const dbData = {
      id: registration.id,
      child_name: registration.childName,
      child_surname: registration.childSurname,
      child_age: registration.childAge,
      parent_name: registration.parentName,
      parent_surname: registration.parentSurname,
      parent_phone: registration.parentPhone,
      timestamp: registration.timestamp
    };

    // Insert new registration
    const { error: insertError } = await supabase
      .from(REGISTRATIONS_TABLE)
      .insert(dbData);

    if (insertError) {
      console.error('Error inserting registration:', insertError);
      return { 
        success: false, 
        method: 'supabase-insert-error',
        removedCount: 0,
        totalCount: 0
      };
    }

    // Get updated total count
    const { count } = await supabase
      .from(REGISTRATIONS_TABLE)
      .select('*', { count: 'exact', head: true });

    return {
      success: true,
      method: 'supabase',
      removedCount: 0,
      totalCount: count || 0,
      isDuplicate: false
    };
  } catch (error) {
    console.error('Supabase add registration failed:', error);
    return { 
      success: false, 
      method: 'supabase-error',
      removedCount: 0,
      totalCount: 0
    };
  }
}

// Helper function to get storage statistics
export async function getStorageStats(): Promise<{
  totalRegistrations: number;
  storageUsed: number;
  storageMethod: string;
}> {
  try {
    const { count, error } = await supabase
      .from(REGISTRATIONS_TABLE)
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.error('Error getting count:', error);
      return {
        totalRegistrations: 0,
        storageUsed: 0,
        storageMethod: 'supabase-error'
      };
    }

    // Estimate storage usage (rough calculation)
    const estimatedBytesPerRecord = 500; // Approximate bytes per registration record
    const totalBytes = (count || 0) * estimatedBytesPerRecord;
    const storageUsedMB = (totalBytes / (1024 * 1024)).toFixed(2);

    return {
      totalRegistrations: count || 0,
      storageUsed: parseFloat(storageUsedMB),
      storageMethod: 'supabase'
    };
  } catch (error) {
    console.error('Error getting storage stats:', error);
    return {
      totalRegistrations: 0,
      storageUsed: 0,
      storageMethod: 'supabase-error'
    };
  }
}
