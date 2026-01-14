export async function GET() {
  const memUsage = process.memoryUsage();
  const uptimeSeconds = process.uptime();
  
  // Verificar si la memoria está en un nivel crítico (>80% del límite de 1GB)
  const memoryLimit = 1024; // MB (configurado en PM2)
  const memoryUsedMB = Math.round(memUsage.heapUsed / 1024 / 1024 * 100) / 100;
  const memoryPercentage = (memoryUsedMB / memoryLimit) * 100;
  
  const isHealthy = memoryPercentage < 80 && uptimeSeconds > 10;
  
  const healthData = {
    status: isHealthy ? 'ok' : 'warning',
    timestamp: new Date().toISOString(),
    uptime: uptimeSeconds,
    uptime_formatted: `${Math.floor(uptimeSeconds / 3600)}h ${Math.floor((uptimeSeconds % 3600) / 60)}m`,
    environment: process.env.NODE_ENV || 'unknown',
    version: process.env.npm_package_version || '1.0.0',
    supabase: {
      url_configured: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      key_configured: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    },
    memory: {
      used_mb: memoryUsedMB,
      total_mb: Math.round(memUsage.heapTotal / 1024 / 1024 * 100) / 100,
      limit_mb: memoryLimit,
      percentage: Math.round(memoryPercentage * 100) / 100,
      rss_mb: Math.round(memUsage.rss / 1024 / 1024 * 100) / 100,
      external_mb: Math.round(memUsage.external / 1024 / 1024 * 100) / 100,
    },
    warnings: memoryPercentage > 80 ? ['High memory usage detected'] : [],
  }

  return new Response(JSON.stringify(healthData, null, 2), {
    status: isHealthy ? 200 : 503,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    },
  })
}

export async function POST() {
  return new Response(JSON.stringify({
    message: 'Health check endpoint - use GET method',
    available_methods: ['GET']
  }), {
    status: 405,
    headers: { 'Content-Type': 'application/json' },
  })
}
