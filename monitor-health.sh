#!/bin/bash

# Script de monitoreo de salud de la aplicación
# Ejecuta cada 5 minutos vía cron para detectar problemas

LOG_FILE="/home/ubuntu/theringsmethod-platform/logs/health-monitor.log"
ALERT_FILE="/home/ubuntu/theringsmethod-platform/logs/health-alerts.log"

# Crear directorio de logs si no existe
mkdir -p /home/ubuntu/theringsmethod-platform/logs

echo "=== Health Check - $(date) ===" >> $LOG_FILE

# Verificar si la app responde
response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/api/health)

if [ "$response" != "200" ]; then
    echo "❌ ALERT: Health check failed with status $response" >> $ALERT_FILE
    echo "❌ Restarting PM2 application..." >> $ALERT_FILE
    pm2 restart theringsmethod
    echo "✅ Application restarted at $(date)" >> $ALERT_FILE
else
    # Obtener detalles de salud
    health_data=$(curl -s http://localhost:3000/api/health)
    memory_percentage=$(echo $health_data | grep -o '"percentage":[0-9.]*' | cut -d':' -f2)
    
    # Si la memoria está sobre 80%, alertar
    if [ $(echo "$memory_percentage > 80" | bc -l 2>/dev/null || echo 0) -eq 1 ]; then
        echo "⚠️  WARNING: High memory usage detected: ${memory_percentage}%" >> $ALERT_FILE
        echo "Memory status: $health_data" >> $ALERT_FILE
    fi
    
    echo "✅ Health check passed - Memory: ${memory_percentage}%" >> $LOG_FILE
fi

# Mantener solo los últimos 1000 líneas de log
tail -n 1000 $LOG_FILE > ${LOG_FILE}.tmp && mv ${LOG_FILE}.tmp $LOG_FILE
tail -n 500 $ALERT_FILE > ${ALERT_FILE}.tmp && mv ${ALERT_FILE}.tmp $ALERT_FILE 2>/dev/null || true

exit 0
