import { createClient } from '@supabase/supabase-js';

// Support new POSTGRES_-prefixed env names with fallback to existing names
const supabaseUrl = process.env.POSTGRES_NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.POSTGRES_NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder';

// Add logging to debug environment variables
if (typeof window === 'undefined') {
  console.log('Supabase URL:', supabaseUrl === 'https://placeholder.supabase.co' ? 'Missing' : 'Set');
  console.log('Supabase Anon Key:', supabaseAnonKey === 'placeholder' ? 'Missing' : 'Set');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
    detectSessionInUrl: false
  }
});

// Database table names
export const REGISTRATIONS_TABLE = 'registrations';
export const HEARTBEATS_TABLE = 'heartbeats';

// Database schema types
export interface Database {
  public: {
    Tables: {
      registrations: {
        Row: {
          id: string;
          child_name: string;
          child_surname: string;
          child_age: string;
          parent_name: string;
          parent_surname: string;
          parent_phone: string;
          timestamp: string;
        };
        Insert: {
          id?: string;
          child_name: string;
          child_surname: string;
          child_age: string;
          parent_name: string;
          parent_surname: string;
          parent_phone: string;
          timestamp: string;
        };
        Update: {
          id?: string;
          child_name?: string;
          child_surname?: string;
          child_age?: string;
          parent_name?: string;
          parent_surname?: string;
          parent_phone?: string;
          timestamp?: string;
        };
      };
      heartbeats: {
        Row: {
          id: string;
          created_at: string;
          info: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          info?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          info?: string | null;
        };
      };
    };
  };
}
