import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { extractDayNumberFromString } from "@/utils/progress-logic";

export async function updateSession(request: NextRequest) {
  // SPAM BLOCKER: Fast exit for known spam patterns to save resources
  const path = request.nextUrl.pathname.toLowerCase();
  const spamKeywords = [
    "goldluck",
    "commodity",
    "casino",
    "slot",
    "bet",
    "poker",
    "virtuals",
    "crypto",
  ];

  if (spamKeywords.some((keyword) => path.includes(keyword))) {
    return new NextResponse("Not Found", { status: 404 });
  }

  // PUBLIC ROUTES: Skip auth check for routes that don't need it
  const publicRoutes = ["/login", "/reset-password", "/auth/", "/api/auth/", "/api/health"];
  const isPublicRoute = publicRoutes.some((route) => path.startsWith(route));

  // For public routes, return early without any request manipulation
  // IMPORTANT: Do NOT use NextResponse.next({ request: { headers } }) for POST routes
  // as it breaks body streaming in Next.js 15
  if (isPublicRoute) {
    const response = NextResponse.next();
    response.headers.set(
      "Cache-Control",
      "no-cache, no-store, max-age=0, must-revalidate",
    );
    response.headers.set("Pragma", "no-cache");
    response.headers.set("Expires", "0");
    return response;
  }

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // Add headers to prevent caching of protected routes
  response.headers.set(
    "Cache-Control",
    "no-cache, no-store, max-age=0, must-revalidate",
  );
  response.headers.set("Pragma", "no-cache");
  response.headers.set("Expires", "0");

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "https://shrswzchkqiobcikdfrn.supabase.co",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNocnN3emNoa3Fpb2JjaWtkZnJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY5NjU3MDYsImV4cCI6MjA1MjU0MTcwNn0.3w5scY6pFfv2_CmuJX2PR8UB7Ib-YZXZa8Gq5WPuWx8",

    {
      global: {
        // Timeout de 8 segundos para evitar requests colgados en middleware
        fetch: (url: string | URL | Request, options: RequestInit = {}) => {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 8000);
          return fetch(url, {
            ...options,
            signal: controller.signal,
          }).finally(() => clearTimeout(timeoutId));
        },
      },
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: "",
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value: "",
            ...options,
          });
        },
      },
    },
  );

  // refreshing the auth token
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Check if the route needs admin protection
  const url = request.nextUrl.clone();
  const isAdminRoute = url.pathname.startsWith("/admin");

  if (isAdminRoute) {
    if (!user) {
      // Redirect to login if not authenticated
      url.pathname = "/login";
      url.searchParams.set("error", "auth_required");
      return NextResponse.redirect(url);
    }

    // Check if user has admin role
    if (user.user_metadata?.role !== "admin") {
      console.warn(`❌ Acceso denegado a ruta admin para: ${user.email}`);
      url.pathname = "/";
      url.searchParams.set("error", "access_denied");
      return NextResponse.redirect(url);
    }

    console.log(`✅ Acceso admin permitido para: ${user.email}`);
  }

  // Check if the route needs routine access protection
  const isProtectedRoute =
    url.pathname.startsWith("/routine/") || url.pathname.startsWith("/video/");

  if (isProtectedRoute && user) {
    try {
      // Extract the routine ID from the URL
      const routineId = url.pathname.split("/")[2];

      if (routineId) {
        // Fetch the post data to get the day information
        const { data: postData, error: postError } = await supabase
          .from("posts")
          .select("day")
          .eq("id", routineId)
          .single();

        if (postError || !postData) {
          // If post doesn't exist, allow navigation (will show 404)
          return response;
        }

        // Extract day number from post data
        const routineDay = extractDayNumberFromString(postData.day);

        // Fetch user progress from the new system
        const { data: progressData, error: progressError } = await supabase
          .from("user_progress")
          .select("routine_day, completed_at, unlocked_at")
          .eq("user_id", user.id)
          .order("routine_day", { ascending: true });

        if (progressError) {
          console.error(
            "Error fetching user progress in middleware:",
            progressError,
          );
          // Allow navigation if there's an error (fail open)
          return response;
        }

        // Calculate maxUnlockedDay based on current time
        const now = new Date();
        let maxUnlockedDay = 1;

        if (progressData && progressData.length > 0) {
          for (const entry of progressData) {
            if (entry.unlocked_at) {
              const unlockedDate = new Date(entry.unlocked_at);
              if (unlockedDate <= now) {
                maxUnlockedDay = Math.max(maxUnlockedDay, entry.routine_day);
              }
            }
          }
        }

        console.log(
          `🔍 Middleware check: Day ${routineDay}, maxUnlocked: ${maxUnlockedDay}, user: ${user.id}`,
        );

        // Check if the routine is unlocked
        if (routineDay > maxUnlockedDay) {
          // Redirect to explore page if routine is locked
          url.pathname = "/explore";
          url.searchParams.set("error", "routine-locked");
          url.searchParams.set("day", routineDay.toString());
          url.searchParams.set("maxDay", maxUnlockedDay.toString());
          console.log(
            `🔒 Middleware: Blocking access to day ${routineDay} (max: ${maxUnlockedDay})`,
          );
          return NextResponse.redirect(url);
        }

        console.log(`✅ Middleware: Allowing access to day ${routineDay}`);
      }
    } catch (error) {
      // In case of any error, allow the request to continue
      console.error("Error checking routine access in middleware:", error);
    }
  }

  return response;
}
