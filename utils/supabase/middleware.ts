import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { extractDayNumberFromString } from '@/utils/progress-logic'

export async function updateSession(request: NextRequest) {
  console.log(`🚀 Middleware called for: ${request.nextUrl.pathname}`)
  
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // Add headers to prevent caching of protected routes
  response.headers.set('Cache-Control', 'no-cache, no-store, max-age=0, must-revalidate')
  response.headers.set('Pragma', 'no-cache')
  response.headers.set('Expires', '0')

  const supabase = createServerClient(
    "https://shrswzchkqiobcikdfrn.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNocnN3emNoa3Fpb2JjaWtkZnJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY5NjU3MDYsImV4cCI6MjA1MjU0MTcwNn0.3w5scY6pFfv2_CmuJX2PR8UB7Ib-YZXZa8Gq5WPuWx8",
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  // refreshing the auth token
  const { data: { user } } = await supabase.auth.getUser()

  // Check if the route needs routine access protection
  const url = request.nextUrl.clone()
  const isProtectedRoute = url.pathname.startsWith('/routine/') || url.pathname.startsWith('/video/')
  
  if (isProtectedRoute && user) {
    try {
      // Extract the routine ID from the URL
      const routineId = url.pathname.split('/')[2]
      
      if (routineId) {
        // Fetch the post data to get the day information
        const { data: postData, error: postError } = await supabase
          .from('posts')
          .select('day')
          .eq('id', routineId)
          .single()
        
        if (postError || !postData) {
          // If post doesn't exist, allow navigation (will show 404)
          return response
        }
        
        // Extract day number from post data
        const routineDay = extractDayNumberFromString(postData.day)
        
        // Fetch user progress from the new system
        const { data: progressData, error: progressError } = await supabase
          .from('user_progress')
          .select('routine_day, completed_at, unlocked_at')
          .eq('user_id', user.id)
          .order('routine_day', { ascending: true })
        
        if (progressError) {
          console.error('Error fetching user progress in middleware:', progressError)
          // Allow navigation if there's an error (fail open)
          return response
        }
        
        // Calculate maxUnlockedDay based on current time
        const now = new Date()
        let maxUnlockedDay = 1
        
        if (progressData && progressData.length > 0) {
          for (const entry of progressData) {
            if (entry.unlocked_at) {
              const unlockedDate = new Date(entry.unlocked_at)
              if (unlockedDate <= now) {
                maxUnlockedDay = Math.max(maxUnlockedDay, entry.routine_day)
              }
            }
          }
        }
        
        console.log(`🔍 Middleware check: Day ${routineDay}, maxUnlocked: ${maxUnlockedDay}, user: ${user.id}`)
        
        // Check if the routine is unlocked
        if (routineDay > maxUnlockedDay) {
          // Redirect to explore page if routine is locked
          url.pathname = '/explore'
          url.searchParams.set('error', 'routine-locked')
          url.searchParams.set('day', routineDay.toString())
          url.searchParams.set('maxDay', maxUnlockedDay.toString())
          console.log(`🔒 Middleware: Blocking access to day ${routineDay} (max: ${maxUnlockedDay})`)
          return NextResponse.redirect(url)
        }
        
        console.log(`✅ Middleware: Allowing access to day ${routineDay}`)
      }
    } catch (error) {
      // In case of any error, allow the request to continue
      console.error('Error checking routine access in middleware:', error)
    }
  }

  return response
}