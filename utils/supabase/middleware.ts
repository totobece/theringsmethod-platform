import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { calculateUnlockedRoutines, extractDayNumberFromString, isRoutineUnlocked, type UserMetadata } from '@/utils/progress-logic'

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

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
        
        // Get user metadata to calculate unlocked routines
        const userMetadata = user.user_metadata as UserMetadata
        const { maxUnlockedDay } = calculateUnlockedRoutines(userMetadata)
        
        // Extract day number from post data
        const routineDay = extractDayNumberFromString(postData.day)
        
        // Check if the routine is unlocked
        if (!isRoutineUnlocked(routineDay, maxUnlockedDay)) {
          // Redirect to explore page if routine is locked
          url.pathname = '/explore'
          url.searchParams.set('error', 'routine-locked')
          url.searchParams.set('day', routineDay.toString())
          url.searchParams.set('maxDay', maxUnlockedDay.toString())
          return NextResponse.redirect(url)
        }
      }
    } catch (error) {
      // In case of any error, allow the request to continue
      console.error('Error checking routine access:', error)
    }
  }

  return response
}