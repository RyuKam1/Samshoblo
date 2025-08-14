import { NextResponse } from 'next/server';
import { getStorageStats } from '@/app/lib/storage';

export async function GET() {
  try {
    const stats = await getStorageStats();
    
    return NextResponse.json({
      ...stats,
      estimatedStorageRemainingMB: 30 - stats.storageUsed // Assuming 30MB Redis limit
    });
  } catch (error) {
    console.error('Storage stats error:', error);
    return NextResponse.json(
      { error: 'Failed to get storage statistics' },
      { status: 500 }
    );
  }
}
