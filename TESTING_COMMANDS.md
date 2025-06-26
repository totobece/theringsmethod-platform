# 🧪 Comandos de Testing para Sistema de Progreso Individual

## 📊 Verificar Progreso Actual del Usuario
```bash
# Verificar estado actual del progreso (requiere estar logueado)
curl -s -X GET "http://localhost:3000/api/user/progress" \
  -H "Content-Type: application/json" | jq .
```

## ⏰ Simular Paso del Tiempo (Desbloquear Siguiente Rutina)
```bash
# Simular que pasaron 24 horas y desbloquear la siguiente rutina
curl -s -X POST "http://localhost:3000/api/test/simulate-time" \
  -H "Content-Type: application/json" | jq .
```

## ✅ Marcar Rutina como Completada (Manual)
```bash
# Completar rutina del día X (cambiar X por el número de día)
curl -s -X POST "http://localhost:3000/api/user/progress" \
  -H "Content-Type: application/json" \
  -d '{"routineDay": 1, "action": "complete"}' | jq .
```

## 🔄 Resetear Progreso del Usuario (Para Testing)
```bash
# CUIDADO: Esto elimina TODO el progreso del usuario actual
curl -s -X DELETE "http://localhost:3000/api/test/reset-progress" \
  -H "Content-Type: application/json" | jq .
```

## 📋 Ver Estado Detallado
```bash
# Ver estado completo del usuario actual
curl -s -X GET "http://localhost:3000/api/test/status" \
  -H "Content-Type: application/json" | jq .
```

## 🎯 Flujo de Testing Recomendado

1. **Verificar estado inicial:**
   ```bash
   curl -s -X GET "http://localhost:3000/api/user/progress" | jq .
   ```

2. **Completar día 1:**
   ```bash
   curl -s -X POST "http://localhost:3000/api/user/progress" \
     -H "Content-Type: application/json" \
     -d '{"routineDay": 1, "action": "complete"}' | jq .
   ```

3. **Verificar que día 2 esté programado para 24h:**
   ```bash
   curl -s -X GET "http://localhost:3000/api/user/progress" | jq .
   ```

4. **Simular paso de 24 horas:**
   ```bash
   curl -s -X POST "http://localhost:3000/api/test/simulate-time" | jq .
   ```

5. **Verificar que día 2 esté disponible:**
   ```bash
   curl -s -X GET "http://localhost:3000/api/user/progress" | jq .
   ```

## 🔍 Interpretar Respuestas

### Progreso Normal:
```json
{
  "maxUnlockedDay": 2,
  "currentDay": 2,
  "totalRoutines": 24,
  "progress": [
    {
      "routine_day": 1,
      "completed_at": "2025-06-24T10:00:00Z",
      "unlocked_at": "2025-06-24T09:00:00Z"
    },
    {
      "routine_day": 2,
      "completed_at": null,
      "unlocked_at": "2025-06-25T10:00:00Z"  // 24h después
    }
  ]
}
```

### Simulación de Tiempo:
```json
{
  "success": true,
  "message": "Day 2 is now unlocked (time simulated)",
  "dayUnlocked": 2,
  "nowAvailable": true
}
```

## ⚠️ Notas Importantes

- Todos los comandos requieren que el usuario esté **logueado** en la aplicación
- Las cookies de sesión deben estar presentes en el navegador
- Para testing más avanzado, usa herramientas como Postman o browser dev tools
- El endpoint `/api/test/simulate-time` es solo para desarrollo
