import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

export async function GET() {
  try {
    // Check environment variables
    const envCheck = {
      KV_URL: !!process.env.KV_URL,
      KV_REST_API_URL: !!process.env.KV_REST_API_URL,
      KV_REST_API_TOKEN: !!process.env.KV_REST_API_TOKEN,
      KV_REST_API_READ_ONLY_TOKEN: !!process.env.KV_REST_API_READ_ONLY_TOKEN,
    };

    console.log('Environment variables check:', envCheck);

    // Test KV connection
    const testKey = 'test-connection';
    const testValue = { timestamp: new Date().toISOString(), message: 'KV connection test' };
    
    try {
      await kv.set(testKey, JSON.stringify(testValue));
      const retrieved = await kv.get(testKey);
      await kv.del(testKey); // Clean up
      
      return NextResponse.json({
        status: 'success',
        message: 'Vercel KV is working correctly',
        environment: envCheck,
        test: {
          write: 'success',
          read: 'success',
          cleanup: 'success'
        }
      });
    } catch (kvError) {
      return NextResponse.json({
        status: 'error',
        message: 'Vercel KV connection failed',
        environment: envCheck,
        error: kvError instanceof Error ? kvError.message : 'Unknown KV error'
      }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: 'General error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
