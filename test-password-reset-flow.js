#!/usr/bin/env node

// Test script para el flujo completo de reset de contraseña
// Uso: node test-password-reset-flow.js [test-email]

const https = require('https');
const http = require('http');

const TEST_EMAIL = process.argv[2] || 'test-reset@theringsmethod.com';
const BASE_URL = 'https://app.theringsmethod.com';

console.log('🔐 === TEST PASSWORD RESET FLOW ===');
console.log(`📧 Email de prueba: ${TEST_EMAIL}`);
console.log(`🌐 Base URL: ${BASE_URL}`);
console.log('');

// Función para hacer requests HTTP/HTTPS
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const isHttps = urlObj.protocol === 'https:';
    const client = isHttps ? https : http;

    const requestOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port || (isHttps ? 443 : 80),
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'TRM-PasswordReset-Test/1.0',
        ...options.headers
      }
    };

    const req = client.request(requestOptions, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data
        });
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (options.body) {
      req.write(options.body);
    }

    req.end();
  });
}

// Test 1: Verificar que la página de reset funciona
async function testResetPasswordPage() {
  console.log('🔍 TEST 1: Reset Password Page Accessibility');
  try {
    const response = await makeRequest(`${BASE_URL}/reset-password`);
    console.log(`   Status: ${response.statusCode}`);

    if (response.statusCode === 200) {
      console.log('   ✅ Reset password page accessible');

      // Check if it contains the request form
      if (response.body.includes('requestPasswordReset') || response.body.includes('Enter your email')) {
        console.log('   ✅ Request form detected');
      } else {
        console.log('   ⚠️  Request form not clearly detected');
      }
    } else {
      console.log('   ❌ Reset password page not accessible');
      console.log(`   Response: ${response.body.substring(0, 200)}`);
    }
  } catch (error) {
    console.log('   ❌ Error accessing reset password page:', error.message);
  }
  console.log('');
}

// Test 2: Verificar el endpoint de auth para reset
async function testAuthResetEndpoint() {
  console.log('🔍 TEST 2: Auth Reset Endpoint');
  try {
    // Test with missing parameters
    const response1 = await makeRequest(`${BASE_URL}/auth/reset-password`);
    console.log(`   Sin parámetros - Status: ${response1.statusCode}`);

    // Test with invalid token
    const response2 = await makeRequest(`${BASE_URL}/auth/reset-password?token_hash=invalid&type=recovery`);
    console.log(`   Con token inválido - Status: ${response2.statusCode}`);

    if (response2.statusCode === 200) {
      console.log('   ✅ Endpoint responds correctly');
      if (response2.body.includes('Invalid reset link') || response2.body.includes('redirecting')) {
        console.log('   ✅ Proper error handling detected');
      }
    } else if (response2.statusCode === 502) {
      console.log('   ❌ 502 Bad Gateway - Check server configuration');
    } else {
      console.log(`   ⚠️  Unexpected response: ${response2.statusCode}`);
    }
  } catch (error) {
    console.log('   ❌ Auth reset endpoint error:', error.message);
  }
  console.log('');
}

// Test 3: Verificar login page tiene el enlace de forgot password
async function testLoginPageForgotLink() {
  console.log('🔍 TEST 3: Login Page Forgot Password Link');
  try {
    const response = await makeRequest(`${BASE_URL}/login`);
    console.log(`   Status: ${response.statusCode}`);

    if (response.statusCode === 200) {
      console.log('   ✅ Login page accessible');

      // Check for forgot password link
      if (response.body.includes('forgotPassword') || response.body.includes('reset-password')) {
        console.log('   ✅ Forgot password link detected');
      } else {
        console.log('   ❌ Forgot password link NOT found');
      }
    } else {
      console.log('   ❌ Login page not accessible');
    }
  } catch (error) {
    console.log('   ❌ Login page test error:', error.message);
  }
  console.log('');
}

// Test 4: Test reset password flow simulation
async function testResetFlowSimulation() {
  console.log('🔍 TEST 4: Reset Flow Simulation');

  // Step 1: Test the request reset endpoint (would be called by the form)
  console.log('   📝 Step 1: Simulating reset request...');

  // This would be the actual request made by the form to Supabase
  // We can't test it directly since it requires Supabase integration,
  // but we can test that the page loads correctly

  try {
    const response = await makeRequest(`${BASE_URL}/reset-password`);
    if (response.statusCode === 200) {
      console.log('   ✅ Reset request page loads correctly');
    }
  } catch (error) {
    console.log('   ❌ Reset request simulation failed:', error.message);
  }

  // Step 2: Test reset form with verified parameter
  console.log('   📝 Step 2: Testing verified reset form...');

  try {
    const response = await makeRequest(`${BASE_URL}/reset-password?verified=true`);
    if (response.statusCode === 200) {
      console.log('   ✅ Verified reset form accessible');

      if (response.body.includes('password') && response.body.includes('confirm')) {
        console.log('   ✅ Password reset form detected');
      } else {
        console.log('   ⚠️  Password reset form not clearly detected');
      }
    }
  } catch (error) {
    console.log('   ❌ Verified reset form test failed:', error.message);
  }

  // Step 3: Test error handling
  console.log('   📝 Step 3: Testing error handling...');

  try {
    const response = await makeRequest(`${BASE_URL}/reset-password?error=link_expired`);
    if (response.statusCode === 200) {
      console.log('   ✅ Error handling page loads correctly');
    }
  } catch (error) {
    console.log('   ❌ Error handling test failed:', error.message);
  }

  console.log('');
}

// Test 5: Headers and security check
async function testSecurityHeaders() {
  console.log('🔍 TEST 5: Security Headers Check');
  try {
    const response = await makeRequest(`${BASE_URL}/reset-password`);
    console.log('   Response Headers Analysis:');

    const importantHeaders = [
      'cache-control',
      'x-frame-options',
      'x-content-type-options',
      'strict-transport-security',
      'content-security-policy'
    ];

    importantHeaders.forEach(header => {
      if (response.headers[header]) {
        console.log(`   ✅ ${header}: ${response.headers[header]}`);
      } else {
        console.log(`   ⚠️  ${header}: Missing`);
      }
    });

    // Check cache control specifically for reset page
    if (response.headers['cache-control'] && response.headers['cache-control'].includes('no-cache')) {
      console.log('   ✅ Proper no-cache headers for security');
    } else {
      console.log('   ⚠️  Cache control might allow caching sensitive pages');
    }

  } catch (error) {
    console.log('   ❌ Security headers test error:', error.message);
  }
  console.log('');
}

// Main test runner
async function runAllTests() {
  console.log('🚀 Iniciando tests del flujo de reset de contraseña...\n');

  await testResetPasswordPage();
  await testAuthResetEndpoint();
  await testLoginPageForgotLink();
  await testResetFlowSimulation();
  await testSecurityHeaders();

  console.log('📋 === RESUMEN Y CONFIGURACIÓN NECESARIA ===');
  console.log('');
  console.log('🔧 Para que el flujo funcione completamente:');
  console.log('');
  console.log('1. 📧 Configurar Supabase Email Template:');
  console.log('   • Ve a Supabase Dashboard → Authentication → Email Templates');
  console.log('   • Selecciona "Reset Password"');
  console.log('   • Cambia el enlace del botón a:');
  console.log('   • <a href="{{ .SiteURL }}/auth/reset-password?token_hash={{ .TokenHash }}&type=recovery">Reset Password</a>');
  console.log('');
  console.log('2. 🌐 URLs importantes:');
  console.log('   • Reset request: /reset-password');
  console.log('   • Token verification: /auth/reset-password');
  console.log('   • Reset form: /reset-password?verified=true');
  console.log('');
  console.log('3. 🔄 Flujo esperado:');
  console.log('   • Usuario va a /login → click "Forgot password"');
  console.log('   • Redirige a /reset-password → ingresa email');
  console.log('   • Supabase envía email → usuario click en enlace');
  console.log('   • Email lleva a /auth/reset-password?token_hash=...&type=recovery');
  console.log('   • Endpoint verifica token → redirige a /reset-password?verified=true');
  console.log('   • Usuario ingresa nueva contraseña → éxito → redirige a /login');
  console.log('');
  console.log('4. 🧪 Para probar manualmente:');
  console.log('   • Ve a https://app.theringsmethod.com/login');
  console.log('   • Click en "¿Olvidaste tu contraseña?"');
  console.log('   • Ingresa un email real');
  console.log('   • Revisa el email y haz click en el enlace');
  console.log('   • Debería llevarte al formulario de nueva contraseña');
  console.log('');
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});

// Run tests
runAllTests().catch(console.error);
