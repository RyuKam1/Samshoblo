import { NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase';

export const dynamic = 'force-dynamic'; // Prevent static optimization

export async function GET(request: Request) {
  // Check for Vercel Cron Secret or custom secret to prevent unauthorized calls
  // When running in Vercel, CRON_SECRET is automatically provided
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    // 1. Insert a new heartbeat
    const { error: insertError } = await supabase
      .from('heartbeats')
      .insert([
        { 
          info: `Keep-alive heartbeat at ${new Date().toISOString()}`,
          created_at: new Date().toISOString()
        }
      ]);

    if (insertError) {
      console.error('Error inserting heartbeat:', insertError);
      return NextResponse.json({ error: 'Failed to insert heartbeat' }, { status: 500 });
    }

    // 2. Cleanup old heartbeats (older than 24 hours)
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const { error: deleteError } = await supabase
      .from('heartbeats')
      .delete()
      .lt('created_at', twentyFourHoursAgo);

    if (deleteError) {
      console.error('Error cleaning up heartbeats:', deleteError);
      // We don't necessarily want to fail the whole request if cleanup fails
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Keep-alive successful',
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('Keep-alive error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
