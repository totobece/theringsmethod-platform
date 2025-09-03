#!/usr/bin/env node

// Test específico para debuggear el token que está fallando
const https = require('https');

const FAILING_TOKEN = 'pkce_e23d70fb3c2975d049e6c3a16d31ebc983f7baac6350afd1c2a1fd3f';
const BASE_URL = 'https://app.theringsmethod.com';

console.log('🔥 === TEST SPECIFIC FAILING TOKEN ===');
console.log(`🎯 Token: ${FAILING_TOKEN}`);
console.log(`🌐 Base URL: ${BASE_URL}`);
console.log('');

function makeHttpsRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);

    const requestOptions = {
      hostname: urlObj.hostname,
      port: 443,
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:139.0) Gecko/20100101 Firefox/139.0',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'es-ES,es;q=0.8,en-US;q=0.5,en;q=0.3',
        'Accept-Encoding': 'gzip, deflate, br, zstd',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'cross-site',
        'Sec-Fetch-User': '?1',
        'Sec-GPC': '1',
        'Upgrade-Insecure-Requests': '1',
        'Connection': 'keep-alive',
        ...options.headers
      }
    };

    const req = https.request(requestOptions, (res) => {
      let data = '';

      // Handle gzip/deflate
      let stream = res;
      if (res.headers['content-encoding'] === 'gzip') {
        const zlib = require('zlib');
        stream = res.pipe(zlib.createGunzip());
      } else if (res.headers['content-encoding'] === 'deflate') {
        const zlib = require('zlib');
        stream = res.pipe(zlib.createInflate());
      }

      stream.on('data', (chunk) => {
        data += chunk;
      });

      stream.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data
        });
      });

      stream.on('error', (error) => {
        reject(error);
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.end();
  });
}

async function testFailingToken() {
  console.log('🔍 TEST 1: Probando con el token exacto que está fallando...');

  const testUrl = `${BASE_URL}/auth/confirm?token_hash=${FAILING_TOKEN}&type=email`;
  console.log(`📍 URL: ${testUrl}`);

  try {
    const response = await makeHttpsRequest(testUrl);

    console.log(`📊 Status Code: ${response.statusCode}`);
    console.log('📋 Response Headers:');
    Object.entries(response.headers).forEach(([key, value]) => {
      console.log(`   ${key}: ${value}`);
    });

    if (response.statusCode === 502) {
      console.log('❌ 502 Bad Gateway confirmado');
      console.log('📄 Response Body (first 500 chars):');
      console.log(response.body.substring(0, 500));
    } else if (response.statusCode === 200) {
      console.log('✅ 200 OK - El endpoint responde correctamente');

      // Check if it's HTML with redirect
      if (response.body.includes('location.href')) {
        const redirectMatch = response.body.match(/location\.href='([^']+)'/);
        if (redirectMatch) {
          console.log(`🔀 Redirect detectado a: ${redirectMatch[1]}`);
        }
      }

      // Check for error messages in HTML
      if (response.body.includes('expired') || response.body.includes('invalid')) {
        console.log('⚠️ Token parece ser inválido o expirado');
      }
    } else {
      console.log(`⚠️ Status inesperado: ${response.statusCode}`);
      console.log('📄 Response Body (first 200 chars):');
      console.log(response.body.substring(0, 200));
    }

  } catch (error) {
    console.log('❌ Error en la request:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.log('🔧 El servidor no está corriendo o no acepta conexiones');
    } else if (error.code === 'ENOTFOUND') {
      console.log('🔧 DNS no puede resolver app.theringsmethod.com');
    }
  }

  console.log('');
}

async function testWithDifferentHeaders() {
  console.log('🔍 TEST 2: Probando con headers diferentes...');

  const testUrl = `${BASE_URL}/auth/confirm?token_hash=${FAILING_TOKEN}&type=email`;

  const headerVariations = [
    {
      name: 'Minimal Headers',
      headers: {
        'User-Agent': 'curl/8.0.0'
      }
    },
    {
      name: 'Chrome Headers',
      headers: {
        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      }
    },
    {
      name: 'With Referer (como si viniera del email)',
      headers: {
        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:139.0) Gecko/20100101 Firefox/139.0',
        'Referer': 'https://tempail.com/',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      }
    }
  ];

  for (const variation of headerVariations) {
    console.log(`   📝 Testing: ${variation.name}`);

    try {
      const response = await makeHttpsRequest(testUrl, { headers: variation.headers });
      console.log(`      Status: ${response.statusCode}`);

      if (response.statusCode === 502) {
        console.log('      ❌ 502 Bad Gateway');
      } else {
        console.log('      ✅ Success');
      }

    } catch (error) {
      console.log(`      ❌ Error: ${error.message}`);
    }

    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log('');
}

async function testServerHealth() {
  console.log('🔍 TEST 3: Verificando salud del servidor...');

  const healthEndpoints = [
    '/api/health',
    '/',
    '/create-password'
  ];

  for (const endpoint of healthEndpoints) {
    console.log(`   📍 Testing: ${BASE_URL}${endpoint}`);

    try {
      const response = await makeHttpsRequest(`${BASE_URL}${endpoint}`);
      console.log(`      Status: ${response.statusCode}`);

      if (response.statusCode === 502) {
        console.log('      ❌ 502 Bad Gateway - Problema del servidor');
      } else if (response.statusCode === 200) {
        console.log('      ✅ OK');
      } else {
        console.log(`      ⚠️ ${response.statusCode}`);
      }

    } catch (error) {
      console.log(`      ❌ Error: ${error.message}`);
    }

    await new Promise(resolve => setTimeout(resolve, 300));
  }

  console.log('');
}

async function runAllTests() {
  await testFailingToken();
  await testWithDifferentHeaders();
  await testServerHealth();

  console.log('🎯 === RESUMEN DE DIAGNÓSTICO ===');
  console.log('');
  console.log('Si SOLO /auth/confirm da 502:');
  console.log('  - Problema específico en el endpoint de confirmación');
  console.log('  - Revisa logs del servidor durante la request');
  console.log('  - Posible problema con el middleware o Supabase client');
  console.log('');
  console.log('Si TODOS los endpoints dan 502:');
  console.log('  - El servidor Next.js no está corriendo');
  console.log('  - pm2 status && pm2 restart all');
  console.log('');
  console.log('Si funciona con curl pero no con navegador:');
  console.log('  - Problema con headers específicos');
  console.log('  - Posible problema de cookies o sesión');
  console.log('');
  console.log('Comandos útiles:');
  console.log('  - pm2 logs --lines 50');
  console.log('  - sudo tail -f /var/log/nginx/error.log');
  console.log('  - sudo tail -f /var/log/nginx/access.log');
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection:', reason);
});

// Run tests
runAllTests().catch(console.error);
