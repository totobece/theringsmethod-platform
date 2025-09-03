// Script para debuggear el flujo de confirmación de autenticación
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('=== DEBUG AUTH CONFIRMATION FLOW ===');
console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Key configured:', supabaseKey ? 'YES' : 'NO');

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables');
  console.log('Please check your .env.local file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testAuthFlow() {
  try {
    console.log('\n🔍 Testing Supabase connection...');

    // Test basic connection
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.error('❌ Supabase connection error:', error.message);
      return;
    }

    console.log('✅ Supabase connection successful');

    // Test sending magic link to a test email
    const testEmail = 'test@example.com';
    console.log(`\n📧 Testing magic link send to: ${testEmail}`);

    const { data: magicData, error: magicError } = await supabase.auth.signInWithOtp({
      email: testEmail,
      options: {
        emailRedirectTo: 'https://app.theringsmethod.com/create-password',
        data: {
          source: 'debug_test',
          challenge_type: '30_day_challenge',
          created_via: 'magic_link'
        }
      }
    });

    if (magicError) {
      console.error('❌ Magic link error:', magicError.message);
      console.error('Error code:', magicError.code);
      console.error('Full error:', magicError);
    } else {
      console.log('✅ Magic link sent successfully');
      console.log('Response data:', magicData);
    }

    // Test auth settings
    console.log('\n🔧 Testing auth settings...');
    console.log('Site URL should be: https://app.theringsmethod.com');
    console.log('Redirect URLs should include: https://app.theringsmethod.com/create-password');

    console.log('\n📝 Next steps to check:');
    console.log('1. Verify Supabase Auth settings in dashboard');
    console.log('2. Check Site URL: https://app.theringsmethod.com');
    console.log('3. Check Redirect URLs include: https://app.theringsmethod.com/**');
    console.log('4. Verify email templates use correct redirect URL');
    console.log('5. Check server logs for 502 errors');

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

// Test specific token verification (if token provided as argument)
async function testTokenVerification(tokenHash, type = 'email') {
  console.log(`\n🔐 Testing token verification...`);
  console.log(`Token: ${tokenHash}`);
  console.log(`Type: ${type}`);

  try {
    const { data, error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type: type
    });

    if (error) {
      console.error('❌ Token verification failed:', error.message);
      console.error('Error code:', error.code);
      return false;
    }

    console.log('✅ Token verification successful');
    console.log('User data:', data.user ? 'User found' : 'No user');
    return true;

  } catch (error) {
    console.error('❌ Unexpected token verification error:', error);
    return false;
  }
}

// Main execution
async function main() {
  await testAuthFlow();

  // If token hash provided as command line argument, test it
  const tokenHash = process.argv[2];
  if (tokenHash) {
    await testTokenVerification(tokenHash);
  }

  console.log('\n=== DEBUG COMPLETE ===');
}

main().catch(console.error);
