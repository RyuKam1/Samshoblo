import { NextRequest, NextResponse } from 'next/server';
import { getRegistrations } from '@/app/lib/storage';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'georgian2024'; // Change this in production

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password } = body;

    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      );
    }

    // Get registrations using shared storage module
    const { data: registrations, method } = await getRegistrations();

    // Sort by timestamp (newest first)
    registrations.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return NextResponse.json({ 
      registrations,
      storageMethod: method,
      warning: method.includes('memory') ? 'Data from memory storage (may be incomplete). Please set up Vercel KV for persistent storage.' : undefined
    });
  } catch (error) {
    console.error('Admin API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


