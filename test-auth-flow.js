#!/usr/bin/env node

// Test script para debuggear el flujo completo de autenticación
// Uso: node test-auth-flow.js [test-email]

const https = require('https');
const http = require('http');

const TEST_EMAIL = process.argv[2] || 'test@theringsmethod.com';
const BASE_URL = 'https://app.theringsmethod.com';

console.log('🔥 === TEST AUTH FLOW - The Rings Method ===');
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
        'User-Agent': 'TRM-Auth-Test/1.0',
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

// Test 1: Health Check
async function testHealthCheck() {
  console.log('🏥 TEST 1: Health Check');
  try {
    const response = await makeRequest(`${BASE_URL}/api/health`);
    console.log(`   Status: ${response.statusCode}`);

    if (response.statusCode === 200) {
      const health = JSON.parse(response.body);
      console.log('   ✅ Servidor funcionando');
      console.log(`   📊 Uptime: ${Math.round(health.uptime)}s`);
      console.log(`   🔧 Environment: ${health.environment}`);
      console.log(`   📦 Supabase URL: ${health.supabase.url_configured ? 'OK' : 'MISSING'}`);
      console.log(`   🔑 Supabase Key: ${health.supabase.key_configured ? 'OK' : 'MISSING'}`);
    } else {
      console.log('   ❌ Health check failed');
      console.log(`   Response: ${response.body}`);
    }
  } catch (error) {
    console.log('   ❌ Health check error:', error.message);
  }
  console.log('');
}

// Test 2: Magic Link Send
async function testMagicLinkSend() {
  console.log('📬 TEST 2: Magic Link Send');
  try {
    const payload = {
      email: TEST_EMAIL
    };

    const response = await makeRequest(`${BASE_URL}/api/auth/magic-link`, {
      method: 'POST',
      body: JSON.stringify(payload)
    });

    console.log(`   Status: ${response.statusCode}`);

    if (response.statusCode === 200) {
      const result = JSON.parse(response.body);
      console.log('   ✅ Magic link enviado exitosamente');
      console.log(`   📧 Email: ${result.email}`);
      console.log(`   ⏰ Timestamp: ${result.timestamp}`);
    } else {
      console.log('   ❌ Magic link failed');
      try {
        const error = JSON.parse(response.body);
        console.log(`   Error: ${error.error}`);
        console.log(`   Details: ${error.details || 'N/A'}`);
      } catch {
        console.log(`   Raw response: ${response.body}`);
      }
    }
  } catch (error) {
    console.log('   ❌ Magic link request error:', error.message);
  }
  console.log('');
}

// Test 3: Auth Confirm URL Test
async function testAuthConfirmEndpoint() {
  console.log('🔐 TEST 3: Auth Confirm Endpoint');
  try {
    // Test con parámetros faltantes
    const response1 = await makeRequest(`${BASE_URL}/auth/confirm`);
    console.log(`   Sin parámetros - Status: ${response1.statusCode}`);

    // Test con parámetros inválidos
    const response2 = await makeRequest(`${BASE_URL}/auth/confirm?token_hash=invalid&type=email`);
    console.log(`   Con token inválido - Status: ${response2.statusCode}`);

    if (response2.statusCode === 200) {
      console.log('   ✅ Endpoint responde correctamente');
      console.log('   📄 HTML response received (expected for invalid token)');
    } else if (response2.statusCode === 502) {
      console.log('   ❌ 502 Bad Gateway - PROBLEMA DETECTADO');
      console.log('   🔧 Posibles causas:');
      console.log('      - Servidor Next.js no responde');
      console.log('      - Nginx no puede conectar con backend');
      console.log('      - Variables de entorno faltantes');
      console.log('      - Error en middleware');
    } else {
      console.log(`   ⚠️  Respuesta inesperada: ${response2.statusCode}`);
    }
  } catch (error) {
    console.log('   ❌ Auth confirm test error:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.log('   🔧 Servidor no está corriendo o no acepta conexiones');
    }
  }
  console.log('');
}

// Test 4: Server Response Headers
async function testServerHeaders() {
  console.log('📋 TEST 4: Server Headers Analysis');
  try {
    const response = await makeRequest(`${BASE_URL}/api/health`);
    console.log('   Response Headers:');
    Object.entries(response.headers).forEach(([key, value]) => {
      console.log(`      ${key}: ${value}`);
    });

    // Check for important headers
    const importantHeaders = ['server', 'x-powered-by', 'content-type'];
    console.log('');
    console.log('   Analysis:');
    importantHeaders.forEach(header => {
      if (response.headers[header]) {
        console.log(`   ✅ ${header}: ${response.headers[header]}`);
      } else {
        console.log(`   ❌ ${header}: Missing`);
      }
    });
  } catch (error) {
    console.log('   ❌ Headers test error:', error.message);
  }
  console.log('');
}

// Test 5: Test Create Password Page
async function testCreatePasswordPage() {
  console.log('🔒 TEST 5: Create Password Page');
  try {
    const response = await makeRequest(`${BASE_URL}/create-password`);
    console.log(`   Status: ${response.statusCode}`);

    if (response.statusCode === 200) {
      console.log('   ✅ Create password page accessible');
      if (response.body.includes('Set a password')) {
        console.log('   ✅ Page content looks correct');
      } else {
        console.log('   ⚠️  Page content might be incorrect');
      }
    } else {
      console.log('   ❌ Create password page not accessible');
    }
  } catch (error) {
    console.log('   ❌ Create password test error:', error.message);
  }
  console.log('');
}

// Main test runner
async function runAllTests() {
  console.log('🚀 Iniciando tests...\n');

  await testHealthCheck();
  await testMagicLinkSend();
  await testAuthConfirmEndpoint();
  await testServerHeaders();
  await testCreatePasswordPage();

  console.log('📋 === RESUMEN Y RECOMENDACIONES ===');
  console.log('');
  console.log('🔍 Para debuggear el problema 502:');
  console.log('');
  console.log('1. Verifica que el servidor Next.js esté corriendo:');
  console.log('   • pm2 status (si usas PM2)');
  console.log('   • ps aux | grep node');
  console.log('');
  console.log('2. Revisa logs del servidor:');
  console.log('   • pm2 logs (si usas PM2)');
  console.log('   • journalctl -f -u tu-servicio');
  console.log('');
  console.log('3. Verifica configuración nginx:');
  console.log('   • nginx -t (test config)');
  console.log('   • systemctl status nginx');
  console.log('');
  console.log('4. Verifica variables de entorno en producción:');
  console.log('   • NEXT_PUBLIC_SUPABASE_URL');
  console.log('   • NEXT_PUBLIC_SUPABASE_ANON_KEY');
  console.log('');
  console.log('5. Revisa el middleware.ts que acabamos de arreglar');
  console.log('');
  console.log('💡 Si el problema persiste:');
  console.log('   • Reinicia el servicio: pm2 restart all');
  console.log('   • Reinicia nginx: sudo systemctl restart nginx');
  console.log('   • Verifica que el puerto 3000 esté libre y accesible');
  console.log('');
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});

// Run tests
runAllTests().catch(console.error);
