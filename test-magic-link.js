// Test script para probar el endpoint de magic link
// Ejecutar con: node test-magic-link.js

const testMagicLink = async () => {
  try {
    console.log('🧪 Probando endpoint de magic link...')
    
    // Simular el formato que podría enviar GoHighLevel
    const testData = {
      email: 'test@example.com',
      redirectTo: 'https://1dc8-2800-810-495-105c-6db7-6589-c7a5-3f42.ngrok-free.app/create-password',
      // Campos adicionales que GoHighLevel podría enviar
      firstName: 'Test',
      lastName: 'User',
      phone: '+1234567890',
      contactId: 'ghl_contact_123',
      opportunityId: 'ghl_opp_456'
    }
    
    const response = await fetch('http://localhost:3000/api/auth/magic-link', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'GoHighLevel-Webhook/1.0',
        'X-GHL-Signature': 'test-signature'
      },
      body: JSON.stringify(testData)
    })
    
    const result = await response.json()
    
    console.log('📊 Respuesta del servidor:')
    console.log('Status:', response.status)
    console.log('Response:', JSON.stringify(result, null, 2))
    
    if (response.ok) {
      console.log('✅ Prueba exitosa!')
    } else {
      console.log('❌ Prueba falló')
    }
    
  } catch (error) {
    console.error('❌ Error en la prueba:', error.message)
  }
}

// También probar el endpoint GET
const testGetEndpoint = async () => {
  try {
    console.log('\n🧪 Probando endpoint GET...')
    
    const response = await fetch('http://localhost:3000/api/auth/magic-link', {
      method: 'GET'
    })
    
    const result = await response.json()
    
    console.log('📊 Respuesta GET:')
    console.log('Status:', response.status)
    console.log('Response:', JSON.stringify(result, null, 2))
    
  } catch (error) {
    console.error('❌ Error en la prueba GET:', error.message)
  }
}

// Ejecutar las pruebas
const runTests = async () => {
  await testGetEndpoint()
  await testMagicLink()
}

runTests()
