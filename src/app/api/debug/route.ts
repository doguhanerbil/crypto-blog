import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

export async function GET() {
  try {
    console.log('=== DEBUG START ===')
    console.log('Environment variables:')
    console.log('SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
    console.log('SERVICE_ROLE_KEY exists:', !!process.env.SUPABASE_SERVICE_ROLE_KEY)
    console.log('SERVICE_ROLE_KEY length:', process.env.SUPABASE_SERVICE_ROLE_KEY?.length)
    
    // Test 1: Basic connection test
    console.log('\n=== Test 1: Basic Connection ===')
    const { data: testData, error: testError } = await supabaseAdmin
      .from('posts')
      .select('*')
      .limit(1)
    
    console.log('Test 1 Result:')
    console.log('Data:', testData)
    console.log('Error:', testError)
    
    // Test 2: Check RLS status
    console.log('\n=== Test 2: RLS Status ===')
    const { data: rlsData, error: rlsError } = await supabaseAdmin
      .rpc('get_rls_status', { table_name: 'posts' })
      .single()
    
    console.log('RLS Status:')
    console.log('Data:', rlsData)
    console.log('Error:', rlsError)
    
    // Test 3: Check table permissions
    console.log('\n=== Test 3: Table Permissions ===')
    const { data: permData, error: permError } = await supabaseAdmin
      .from('information_schema.table_privileges')
      .select('*')
      .eq('table_name', 'posts')
      .eq('table_schema', 'public')
    
    console.log('Table Permissions:')
    console.log('Data:', permData)
    console.log('Error:', permError)
    
    // Test 4: Try with different client
    console.log('\n=== Test 4: Different Client ===')
    const { createClient } = await import('@supabase/supabase-js')
    
    const testClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )
    
    const { data: testClientData, error: testClientError } = await testClient
      .from('posts')
      .select('*')
      .limit(1)
    
    console.log('Test Client Result:')
    console.log('Data:', testClientData)
    console.log('Error:', testClientError)
    
    console.log('\n=== DEBUG END ===')
    
    return NextResponse.json({
      environment: {
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
        serviceRoleKeyExists: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
        serviceRoleKeyLength: process.env.SUPABASE_SERVICE_ROLE_KEY?.length
      },
      test1: { data: testData, error: testError },
      test2: { data: rlsData, error: rlsError },
      test3: { data: permData, error: permError },
      test4: { data: testClientData, error: testClientError }
    })
    
  } catch (error) {
    console.error('Debug error:', error)
    return NextResponse.json({ error: 'Debug failed', details: error }, { status: 500 })
  }
} 