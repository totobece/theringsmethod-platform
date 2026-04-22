# Solucion: Problemas de Autenticacion y Reset de Contrasena

## Diagnostico Realizado (22 Abril 2026)

### Estado Actual:
- ✅ Supabase responde correctamente (431ms)
- ✅ Railway/produccion responde (682ms)  
- ✅ Login endpoint funciona
- ⚠️ **Site URL NO configurada en Supabase**
- ⚠️ **Redirect URLs vacias**

### Problema Identificado:
Supabase no tiene configurado el Site URL ni las Redirect URLs permitidas.

---

## SOLUCION: Configurar Supabase Dashboard

### Paso 1: URL Configuration
1. Ve a [Supabase Dashboard](https://supabase.com/dashboard)
2. Selecciona tu proyecto `shrswzchkqiobcikdfrn`
3. Ve a **Authentication** > **URL Configuration**
4. Configura:
   - **Site URL**: `https://app.theringsmethod.com`
   - **Redirect URLs**: Agrega estos patrones:
     ```
     https://app.theringsmethod.com/**
     https://app.theringsmethod.com/auth/callback
     https://app.theringsmethod.com/auth/reset-password
     ```

### Paso 2: Email Template de Reset Password
1. Ve a **Authentication** > **Email Templates**
2. Selecciona **Reset Password**
3. Asegurate que el template contenga:
```html
<h2>Reset Password</h2>

<p>Follow this link to reset the password for your user:</p>

<p>
<a href="{{ .SiteURL }}/auth/reset-password?token_hash={{ .TokenHash }}&type=recovery">
  Reset Password
</a>
</p>
```

### Paso 3: Verificar Variables de Entorno en Railway
Ve a Railway Dashboard y verifica que estas variables existan:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

---

## Flujo Esperado (Despues de la correccion)

### Reset de Contrasena:
1. Usuario va a `/login`
2. Click en "Olvide mi contrasena"
3. Ingresa email en `/reset-password`
4. Supabase envia email con link a `/auth/reset-password?token_hash=XXX&type=recovery`
5. Endpoint verifica token y redirige a `/reset-password?verified=true`
6. Usuario ingresa nueva contrasena
7. Exito -> redirige a `/login`

### Login Normal:
1. Usuario ingresa credenciales en `/login`
2. API llama a Supabase auth
3. Si es correcto, establece cookies de sesion
4. Redirige a `/`

---

## Comandos Utiles para Debugging

### Ver logs de Railway:
```bash
# En Railway Dashboard > Deployments > Ver logs
```

### Probar login localmente:
```bash
npm run dev
# Ir a http://localhost:3000/login
```

### Testear conectividad con Supabase:
```bash
node debug-railway-issues.js
```

---

## Notas Adicionales

- Los timeouts estan configurados en 8-10 segundos. Si Supabase tarda mas, dara error.
- Asegurate que Railway y Supabase esten en regiones cercanas para menor latencia.
- El Site URL DEBE coincidir con tu dominio de produccion.
