module.exports = {
  apps: [{
    name: 'theringsmethod',
    script: 'node_modules/next/dist/bin/next',
    args: 'start',
    cwd: '/home/ubuntu/theringsmethod-platform',
    instances: 1,
    exec_mode: 'fork',
    // Auto restart si usa más de 1GB de memoria
    max_memory_restart: '1G',
    // Auto restart si falla
    autorestart: true,
    // Máximo de reintentos
    max_restarts: 10,
    // Tiempo mínimo antes de considerar la app como "online"
    min_uptime: '10s',
    // Espera entre reintentos
    restart_delay: 4000,
    // Kill timeout - CRÍTICO para evitar procesos zombie
    kill_timeout: 5000,
    // Listen timeout
    listen_timeout: 10000,
    env: {
      NODE_ENV: 'production',
      NODE_OPTIONS: '--max-old-space-size=1024',
      SUPABASE_URL: 'https://shrswzchkqiobcikdfrn.supabase.co',
      SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNocnN3emNoa3Fpb2JjaWtkZnJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY5NjU3MDYsImV4cCI6MjA1MjU0MTcwNn0.3w5scY6pFfv2_CmuJX2PR8UB7Ib-YZXZa8Gq5WPuWx8',
      NEXT_PUBLIC_SUPABASE_URL: 'https://shrswzchkqiobcikdfrn.supabase.co',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNocnN3emNoa3Fpb2JjaWtkZnJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY5NjU3MDYsImV4cCI6MjA1MjU0MTcwNn0.3w5scY6pFfv2_CmuJX2PR8UB7Ib-YZXZa8Gq5WPuWx8',
      SUPABASE_SERVICE_ROLE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNocnN3emNoa3Fpb2JjaWtkZnJuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNjk2NTcwNiwiZXhwIjoyMDUyNTQxNzA2fQ.ixKSiXKsuudOoCwfUPfU_MeBCbFVEKVctwR1vfN4pkw'
    },
    // Configuración de logs
    error_file: '/home/ubuntu/.pm2/logs/theringsmethod-error.log',
    out_file: '/home/ubuntu/.pm2/logs/theringsmethod-out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    // Cron para restart automático a las 4 AM (menos tráfico)
    cron_restart: '0 4 * * *'
  }]
};
