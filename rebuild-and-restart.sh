#!/bin/bash

# Script para limpiar la caché de Next.js y reiniciar la aplicación
# Ejecutar manualmente o programar vía cron

APP_DIR="/home/ubuntu/theringsmethod-platform"
LOG_FILE="$APP_DIR/logs/cache-clear.log"

mkdir -p "$APP_DIR/logs"

echo "=== Cache Clear - $(date) ===" >> $LOG_FILE

cd $APP_DIR

echo "📦 Building production..." >> $LOG_FILE
npm run build >> $LOG_FILE 2>&1

if [ $? -eq 0 ]; then
    echo "✅ Build successful" >> $LOG_FILE
    
    echo "🔄 Restarting PM2..." >> $LOG_FILE
    pm2 restart theringsmethod >> $LOG_FILE 2>&1
    
    echo "✅ Application restarted successfully" >> $LOG_FILE
    echo "==================================" >> $LOG_FILE
else
    echo "❌ Build failed - check logs" >> $LOG_FILE
    echo "==================================" >> $LOG_FILE
    exit 1
fi

exit 0
