export async function GET() {
  const healthData = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'unknown',
    version: process.env.npm_package_version || '1.0.0',
    supabase: {
      url_configured: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      key_configured: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    },
    memory: {
      used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024 * 100) / 100,
      total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024 * 100) / 100,
    }
  }

  return new Response(JSON.stringify(healthData, null, 2), {
    status: 200,
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
