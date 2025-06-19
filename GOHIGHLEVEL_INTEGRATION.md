# GoHighLevel Magic Link Integration

Esta integración permite que los compradores del "30 day challenge" en GoHighLevel reciban automáticamente un magic link para acceder a la plataforma.

## 📋 Configuración Actual

### API Endpoint
```
POST /api/auth/magic-link
```

### Request Format Esperado
```json
{
  "email": "user@example.com",
  "redirectTo": "https://tudominio.com/create-password" (opcional)
}
```

### Logs Implementados
El endpoint ahora incluye logs detallados para debuggear:
- ✅ URL y método del request
- ✅ Todos los headers recibidos
- ✅ JSON raw completo del body
- ✅ JSON parseado con formato
- ✅ Email y redirectTo extraídos
- ✅ Resultado de Supabase auth
- ✅ Errores detallados

## 🧪 Testing Local

### 1. Probar el endpoint localmente
```bash
# Ejecutar el servidor de desarrollo
npm run dev

# En otra terminal, probar el endpoint
node test-magic-link.js
```

### 2. Verificar logs
Los logs aparecerán en la consola del servidor de desarrollo con emojis para fácil identificación:
- 🔵 Información general
- ✅ Operaciones exitosas  
- ❌ Errores

## 🔗 URL del Webhook

### Desarrollo (ngrok)
```
https://1dc8-2800-810-495-105c-6db7-6589-c7a5-3f42.ngrok-free.app/api/auth/magic-link
```

### Producción
```
https://tudominio.com/api/auth/magic-link
```

## 📝 Configuración en GoHighLevel

### 1. Crear Webhook
1. Ir a Settings → Integrations → Webhooks
2. Crear nuevo webhook
3. URL: `[URL del webhook]/api/auth/magic-link`
4. Método: POST
5. Trigger: Cuando se complete la compra del "30 day challenge"

### 2. Configurar Payload
El webhook debe enviar un JSON con al menos:
```json
{
  "email": "{{contact.email}}",
  "firstName": "{{contact.first_name}}",
  "lastName": "{{contact.last_name}}"
}
```

### 3. Headers Recomendados
```
Content-Type: application/json
User-Agent: GoHighLevel-Webhook/1.0
```

## 🔍 Debugging

### Ver logs en tiempo real
```bash
# Si usas Vercel
vercel logs --follow

# En desarrollo
npm run dev
# Los logs aparecen en la consola
```

### Probar manualmente con curl
```bash
curl -X POST https://tu-url/api/auth/magic-link \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'
```

## 📧 Flujo de Usuario

1. **Compra**: Usuario compra "30 day challenge" en GoHighLevel
2. **Webhook**: GoHighLevel envía POST a `/api/auth/magic-link`
3. **Magic Link**: Supabase envía email con magic link al usuario
4. **Acceso**: Usuario hace click en el link y es redirigido a `/create-password`
5. **Registro**: Usuario completa su registro estableciendo una contraseña

## ⚡ Configuración de Supabase

El magic link está configurado con:
- `shouldCreateUser: true` - Crea usuario automáticamente
- `emailRedirectTo` - Redirige a `/create-password`
- `data` - Metadata del usuario (source, challenge_type, etc.)

## 🚨 Troubleshooting

### Problema: No llegan requests
- Verificar que la URL del webhook sea correcta
- Comprobar que GoHighLevel puede alcanzar la URL (no localhost)
- Revisar configuración del trigger en GoHighLevel

### Problema: Error 400 "Email is required"
- Verificar formato del JSON enviado por GoHighLevel
- Comprobar logs para ver qué está llegando exactamente

### Problema: Magic link no se envía
- Verificar configuración de email en Supabase
- Comprobar que el email template esté configurado
- Revisar logs de Supabase auth

## 📋 Próximos Pasos

1. ✅ Logs detallados implementados
2. 🔄 Crear página `/create-password`
3. 🔄 Configurar webhook en GoHighLevel
4. 🔄 Probar flujo completo
5. 🔄 Deploy a producción
