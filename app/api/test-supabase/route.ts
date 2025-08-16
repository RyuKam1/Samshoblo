import { NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase';

export async function GET() {
  try {
    console.log('Testing Supabase connection...');
    
    // Test 1: Basic connection
    const { data: testData, error: testError } = await supabase
      .from('registrations')
      .select('count', { count: 'exact', head: true });
    
    if (testError) {
      console.error('Supabase connection error:', testError);
      return NextResponse.json({
        success: false,
        error: 'Supabase connection failed',
        details: testError.message,
        code: testError.code
      }, { status: 500 });
    }
    
    // Test 2: Try to insert a test record
    const testRecord = {
      child_name: 'Test',
      child_surname: 'User',
      child_age: '10',
      parent_name: 'Test',
      parent_surname: 'Parent',
      parent_phone: '+995 599 000 000',
      timestamp: new Date().toISOString()
    };
    
    const { data: insertData, error: insertError } = await supabase
      .from('registrations')
      .insert(testRecord)
      .select();
    
    if (insertError) {
      console.error('Insert test failed:', insertError);
      return NextResponse.json({
        success: false,
        error: 'Insert test failed',
        details: insertError.message,
        code: insertError.code,
        hint: 'This suggests the table structure or permissions are incorrect'
      }, { status: 500 });
    }
    
    // Test 3: Delete the test record
    if (insertData && insertData[0]) {
      await supabase
        .from('registrations')
        .delete()
        .eq('id', insertData[0].id);
    }
    
    return NextResponse.json({
      success: true,
      message: 'Supabase connection and operations working correctly',
      count: testData,
      testInsert: 'Passed'
    });
    
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({
      success: false,
      error: 'Unexpected error occurred',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
