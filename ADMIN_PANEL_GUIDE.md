# Panel de Administración - Extender Trials

## 📋 Descripción

Panel administrativo para que el equipo de Duorings pueda extender los períodos de trial de usuarios en la plataforma.

## 🔐 Seguridad

- ✅ Solo usuarios con rol `admin` pueden acceder
- ✅ Verificación en middleware (bloquea URL directa)
- ✅ Verificación en API (bloquea llamadas directas)
- ✅ Logs de todas las acciones
- ✅ Validaciones estrictas de datos

## 🚀 Cómo Usar

### Paso 1: Hacer Admin a un Usuario de Duorings

Necesitas la **Service Role Key** de Supabase (la consigues en el dashboard de Supabase):

```bash
# Configurar la Service Role Key
export SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.tu-service-role-key-completa"

# Hacer admin a un usuario
./make-admin.sh email@duorings.com
```

Deberías ver algo como:
```
✅ Usuario actualizado exitosamente:
   Email: email@duorings.com
   ID: abc123...
   Role: admin

🎉 El usuario ahora puede acceder a /admin/extend-trial
```

### Paso 2: Acceder al Panel

1. El usuario admin debe hacer login en la plataforma
2. Ir a: `https://app.theringsmethod.com/admin/extend-trial`
3. Verá el panel de administración

### Paso 3: Extender Trial de un Usuario

1. Ingresar el **email exacto** del usuario
2. Ingresar el número de **días adicionales** (1-365)
3. Click en "Extender Trial"
4. Ver confirmación con la nueva fecha de expiración

## 📊 Ejemplos de Uso

### Extender 30 días a un usuario cuyo trial expira mañana
- Email: `usuario@ejemplo.com`
- Días: `30`
- Resultado: Trial expirará en 31 días desde hoy

### Extender 90 días a un usuario cuyo trial ya expiró
- Email: `usuario@ejemplo.com`
- Días: `90`
- Resultado: Trial expirará en 90 días desde hoy

## 🔍 Logs

Todas las acciones quedan registradas en los logs de PM2:

```bash
pm2 logs theringsmethod | grep "Trial extendido"
```

Ejemplo de log:
```
✅ Trial extendido por admin admin@duorings.com:
   - Usuario: usuario@ejemplo.com
   - Días agregados: 30
   - Nueva fecha de expiración: 2026-02-15T18:00:00.000Z
```

## ⚠️ Seguridad Importante

### ¿Qué pasa si alguien intenta acceder sin ser admin?

**Caso 1: URL directa sin login**
```
Usuario no autenticado → Redirect a /login
```

**Caso 2: URL directa con login pero sin rol admin**
```
Usuario sin permisos → Redirect a / con error "access_denied"
Log: ❌ Acceso denegado a ruta admin para: user@example.com
```

**Caso 3: Llamada directa a API sin ser admin**
```
HTTP 403 Forbidden
Error: "No tienes permisos para realizar esta acción"
Log: ❌ Intento de acceso no autorizado al panel admin por: user@example.com
```

## 🛠️ Mantenimiento

### Ver usuarios admin actuales

```bash
# Necesitas acceso a Supabase Dashboard
# Ve a: Authentication → Users → Filter by user_metadata.role = "admin"
```

### Remover permisos de admin

```bash
# Modifica make-admin.sh cambiando:
role: 'admin'
# por:
role: 'user'  # o eliminar la propiedad
```

## 📝 Notas Técnicas

- **Tabla afectada**: `auth.users` (user_metadata.trial_end_date)
- **Protección middleware**: `utils/supabase/middleware.ts`
- **API endpoint**: `app/api/admin/extend-trial/route.ts`
- **UI**: `app/admin/extend-trial/page.tsx`
- **Máximo días**: 365 (configurable en validaciones)

## 🎨 Estilo Visual

El panel sigue el mismo diseño de la plataforma:
- Fondo gris oscuro (`bg-gray-700`)
- Tarjetas con bordes (`border-2 border-gray-600`)
- Botón principal morado (`bg-purple-600`)
- Navbar consistente

## 🆘 Troubleshooting

### "No tienes permisos para acceder a esta página"
→ El usuario no tiene rol `admin` en user_metadata

### "Usuario no encontrado"
→ Verifica que el email sea exacto (case-insensitive pero debe estar registrado)

### "Error al actualizar trial del usuario"
→ Revisa los logs de PM2 para más detalles: `pm2 logs theringsmethod --lines 50`

### La página de admin no carga
→ Verifica que el build y restart se hayan completado correctamente:
```bash
npm run build
pm2 restart theringsmethod
```

## 📞 Contacto

Para cualquier duda sobre el panel de admin, revisar los logs de servidor o contactar al desarrollador de la plataforma.
