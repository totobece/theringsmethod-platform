#!/usr/bin/env node

/**
 * Script de diagnostico para problemas de Railway + Supabase
 * Uso: node debug-railway-issues.js
 */

const https = require('https');

const SUPABASE_URL = 'https://shrswzchkqiobcikdfrn.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNocnN3emNoa3Fpb2JjaWtkZnJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY5NjU3MDYsImV4cCI6MjA1MjU0MTcwNn0.3w5scY6pFfv2_CmuJX2PR8UB7Ib-YZXZa8Gq5WPuWx8';
const PRODUCTION_URL = 'https://app.theringsmethod.com';

function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const requestOptions = {
      hostname: urlObj.hostname,
      port: 443,
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        ...options.headers
      },
      timeout: options.timeout || 10000
    };

    const req = https.request(requestOptions, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data
        });
      });
    });

    req.on('error', (error) => reject(error));
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    if (options.body) req.write(options.body);
    req.end();
  });
}

async function testSupabaseConnection() {
  console.log('\n🔍 TEST 1: Conectividad con Supabase');
  console.log('━'.repeat(50));
  
  try {
    const start = Date.now();
    const response = await makeRequest(`${SUPABASE_URL}/rest/v1/`, {
      timeout: 15000
    });
    const elapsed = Date.now() - start;
    
    console.log(`   ✅ Supabase responde en ${elapsed}ms`);
    console.log(`   Status: ${response.statusCode}`);
    
    if (elapsed > 5000) {
      console.log('   ⚠️  ADVERTENCIA: Respuesta lenta (>5s). Puede causar timeouts.');
    }
  } catch (error) {
    console.log(`   ❌ Error conectando a Supabase: ${error.message}`);
    if (error.message === 'Request timeout') {
      console.log('   ❌ CRITICO: Supabase no responde. Verifica:');
      console.log('      - Que el proyecto Supabase este activo');
      console.log('      - Que no haya problemas de red desde Railway');
    }
  }
}

async function testAuthEndpoint() {
  console.log('\n🔍 TEST 2: Endpoint de autenticacion');
  console.log('━'.repeat(50));
  
  try {
    const start = Date.now();
    const response = await makeRequest(`${SUPABASE_URL}/auth/v1/settings`, {
      timeout: 15000
    });
    const elapsed = Date.now() - start;
    
    console.log(`   ✅ Auth endpoint responde en ${elapsed}ms`);
    console.log(`   Status: ${response.statusCode}`);
    
    if (response.statusCode === 200) {
      const settings = JSON.parse(response.body);
      console.log(`   Site URL: ${settings.site_url || 'No configurada'}`);
      console.log(`   External URLs: ${JSON.stringify(settings.external_urls || [])}`);
      
      // Verificar si app.theringsmethod.com esta en las URLs permitidas
      const hasCorrectUrl = settings.external_urls?.some(url => 
        url.includes('theringsmethod.com')
      );
      
      if (!hasCorrectUrl) {
        console.log('   ⚠️  PROBLEMA: theringsmethod.com no esta en las URLs permitidas');
        console.log('   Solucion: Agregar https://app.theringsmethod.com en Supabase:');
        console.log('            Authentication > URL Configuration > Redirect URLs');
      }
    }
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
  }
}

async function testProductionSite() {
  console.log('\n🔍 TEST 3: Sitio de produccion');
  console.log('━'.repeat(50));
  
  try {
    const start = Date.now();
    const response = await makeRequest(PRODUCTION_URL, {
      timeout: 15000
    });
    const elapsed = Date.now() - start;
    
    console.log(`   ✅ Sitio responde en ${elapsed}ms`);
    console.log(`   Status: ${response.statusCode}`);
    
    if (response.statusCode === 502) {
      console.log('   ❌ CRITICO: 502 Bad Gateway');
      console.log('   Problema: Railway no puede conectar con la aplicacion');
      console.log('   Soluciones:');
      console.log('   1. Verificar que el servicio este corriendo en Railway');
      console.log('   2. Verificar las variables de entorno en Railway');
      console.log('   3. Revisar los logs de Railway');
    }
    
    if (response.statusCode === 500) {
      console.log('   ❌ Error 500 del servidor');
      console.log('   Revisar logs de Railway para mas detalles');
    }
  } catch (error) {
    console.log(`   ❌ Error accediendo al sitio: ${error.message}`);
  }
}

async function testLoginEndpoint() {
  console.log('\n🔍 TEST 4: Endpoint de login');
  console.log('━'.repeat(50));
  
  try {
    const start = Date.now();
    const response = await makeRequest(`${PRODUCTION_URL}/api/auth/login`, {
      method: 'POST',
      timeout: 15000,
      body: JSON.stringify({ email: 'test@test.com', password: 'wrongpassword' })
    });
    const elapsed = Date.now() - start;
    
    console.log(`   Endpoint responde en ${elapsed}ms`);
    console.log(`   Status: ${response.statusCode}`);
    
    if (response.statusCode === 504) {
      console.log('   ❌ TIMEOUT: El login tardo mas de 10 segundos');
      console.log('   Problema: Railway no puede conectar con Supabase rapido');
      console.log('   Soluciones:');
      console.log('   1. Verificar la region de Railway vs Supabase');
      console.log('   2. Aumentar el timeout en /app/api/auth/login/route.ts');
    }
    
    if (response.statusCode === 401) {
      console.log('   ✅ Login endpoint funciona (credenciales incorrectas como se esperaba)');
    }
    
    const body = JSON.parse(response.body);
    console.log(`   Respuesta: ${JSON.stringify(body)}`);
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
  }
}

async function testResetPasswordEndpoint() {
  console.log('\n🔍 TEST 5: Endpoint de reset de password');
  console.log('━'.repeat(50));
  
  try {
    const start = Date.now();
    const response = await makeRequest(`${PRODUCTION_URL}/auth/reset-password?token_hash=test&type=recovery`, {
      timeout: 15000
    });
    const elapsed = Date.now() - start;
    
    console.log(`   Endpoint responde en ${elapsed}ms`);
    console.log(`   Status: ${response.statusCode}`);
    
    if (response.statusCode === 200) {
      if (response.body.includes('Invalid reset link') || response.body.includes('redirecting')) {
        console.log('   ✅ Reset endpoint responde correctamente');
      }
    }
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
  }
}

async function checkRequiredEnvVars() {
  console.log('\n🔍 TEST 6: Variables de entorno requeridas');
  console.log('━'.repeat(50));
  
  const required = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_URL',
    'SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY'
  ];
  
  console.log('   Variables que Railway debe tener configuradas:');
  required.forEach(v => console.log(`   - ${v}`));
  
  console.log('\n   ⚠️  Verifica en Railway Dashboard > Variables que todas existan');
}

async function main() {
  console.log('🛠️  DIAGNOSTICO RAILWAY + SUPABASE');
  console.log('='.repeat(50));
  console.log(`Fecha: ${new Date().toISOString()}`);
  console.log(`Supabase: ${SUPABASE_URL}`);
  console.log(`Produccion: ${PRODUCTION_URL}`);
  
  await testSupabaseConnection();
  await testAuthEndpoint();
  await testProductionSite();
  await testLoginEndpoint();
  await testResetPasswordEndpoint();
  await checkRequiredEnvVars();
  
  console.log('\n' + '='.repeat(50));
  console.log('📋 CHECKLIST DE SOLUCIONES');
  console.log('='.repeat(50));
  console.log(`
1. SUPABASE DASHBOARD:
   □ Authentication > URL Configuration
     - Site URL: https://app.theringsmethod.com
     - Redirect URLs: https://app.theringsmethod.com/**
   
   □ Authentication > Email Templates > Reset Password
     - URL debe ser: {{ .SiteURL }}/auth/reset-password?token_hash={{ .TokenHash }}&type=recovery

2. RAILWAY DASHBOARD:
   □ Verificar que todas las variables de entorno esten configuradas
   □ Revisar los logs para ver errores especificos
   □ Verificar que el servicio este "Active" (no sleeping)

3. SI HAY TIMEOUTS:
   □ Verificar la region de Railway (mismo continente que Supabase idealmente)
   □ Considerar aumentar los timeouts en:
     - /utils/supabase/middleware.ts (linea con timeout 8000)
     - /app/api/auth/login/route.ts (linea con timeout 10000)
`);
}

main().catch(console.error);
