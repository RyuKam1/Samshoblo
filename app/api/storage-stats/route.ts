import { NextResponse } from 'next/server';
import { getStorageStats } from '@/app/lib/storage';

export async function GET() {
  try {
    const stats = await getStorageStats();
    
    return NextResponse.json({
      ...stats,
      // Supabase free plan has 500MB storage limit
      estimatedStorageRemainingMB: 500 - stats.storageUsed,
      storageLimitMB: 500,
      storagePlan: 'Supabase Free'
    });
  } catch (error) {
    console.error('Storage stats error:', error);
    return NextResponse.json(
      { error: 'Failed to get storage statistics' },
      { status: 500 }
    );
  }
}
