import { createServerClient } from '@supabase/ssr'
import type { IncomingMessage, ServerResponse } from 'http'

// Tipos para cookies en API/pages
interface Cookie {
  name: string
  value: string
  options?: Record<string, unknown>
}

// Wrapper para cookies en API/pages
function nodeCookiesWrapper(req: IncomingMessage, res: ServerResponse) {
  return {
    getAll() {
      const cookieHeader = req.headers?.cookie || ''
      return cookieHeader.split(';').filter(Boolean).map((cookie: string) => {
        const [name, ...rest] = cookie.trim().split('=')
        return { name, value: rest.join('=') }
      })
    },
    setAll(cookiesToSet: Cookie[]) {
      cookiesToSet.forEach(({ name, value, options }) => {
        let cookieStr = `${name}=${value}`
        if (options && options.path) cookieStr += `; Path=${options.path}`
        res.setHeader('Set-Cookie', cookieStr)
      })
    },
  }
}

export async function createClient(req?: IncomingMessage, res?: ServerResponse) {
  let isAppDir = false
  let cookiesFn: (() => unknown) | null = null
  try {
    // Importación dinámica solo si está disponible
    const mod = await import('next/headers')
    cookiesFn = mod.cookies
    isAppDir = true
  } catch {
    cookiesFn = null
    isAppDir = false
  }

  if (isAppDir && cookiesFn) {
    let cookieStore = cookiesFn()
    if (cookieStore instanceof Promise) {
      cookieStore = await cookieStore
    }
    // Type assertion para que TypeScript reconozca los métodos
    const store = cookieStore as { getAll: () => Cookie[]; set: (name: string, value: string, options?: Record<string, unknown>) => void }
    return createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return store.getAll()
          },
          setAll(cookiesToSet: Cookie[]) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                store.set(name, value, options)
              )
            } catch {
              // Puede ignorarse en Server Component
            }
          },
        },
      }
    )
  } else {
    if (!req || !res) {
      throw new Error('Para usar createClient fuera de app/, debes pasar req y res')
    }
    return createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: nodeCookiesWrapper(req, res),
      }
    )
  }
}