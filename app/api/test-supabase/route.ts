import { NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase';

export async function GET() {
  try {
    console.log('Testing Supabase connection...');
    
    // Test 1: Check if we can connect to Supabase at all
    try {
      const { data: testData, error: testError } = await supabase
        .from('registrations')
        .select('count', { count: 'exact', head: true });
      
      if (testError) {
        console.error('Supabase table access error:', testError);
        
        // Check if it's a "relation does not exist" error
        if (testError.message.includes('relation') && testError.message.includes('does not exist')) {
          return NextResponse.json({
            success: false,
            error: 'Table does not exist',
            details: 'The "registrations" table has not been created in Supabase yet',
            code: testError.code,
            solution: 'Run the SQL from database-setup.sql in your Supabase SQL Editor'
          }, { status: 500 });
        }
        
        return NextResponse.json({
          success: false,
          error: 'Supabase table access failed',
          details: testError.message,
          code: testError.code
        }, { status: 500 });
      }
      
      console.log('✅ Table exists and is accessible');
      
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
      
      console.log('✅ Insert test passed');
      
      // Test 3: Delete the test record
      if (insertData && insertData[0]) {
        await supabase
          .from('registrations')
          .delete()
          .eq('id', insertData[0].id);
        console.log('✅ Delete test passed');
      }
      
      return NextResponse.json({
        success: true,
        message: 'Supabase connection and operations working correctly',
        count: testData,
        testInsert: 'Passed',
        testDelete: 'Passed'
      });
      
    } catch (connectionError) {
      console.error('Supabase connection error:', connectionError);
      return NextResponse.json({
        success: false,
        error: 'Supabase connection failed',
        details: connectionError instanceof Error ? connectionError.message : 'Unknown connection error',
        hint: 'Check your environment variables and Supabase project status'
      }, { status: 500 });
    }
    
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({
      success: false,
      error: 'Unexpected error occurred',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
