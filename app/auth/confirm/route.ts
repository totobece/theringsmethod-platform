import { type EmailOtpType } from '@supabase/supabase-js'
import { type NextRequest, NextResponse } from 'next/server'

import { createClient } from '@/utils/supabase/server'

// Creating a handler to a GET request to route /auth/confirm
export async function GET(request: NextRequest) {
  try {
    console.log('Auth confirm called with URL:', request.url);
    
    const { searchParams } = new URL(request.url)
    const token_hash = searchParams.get('token_hash')
    const type = searchParams.get('type') as EmailOtpType | null
    
    console.log('Token hash present:', !!token_hash);
    console.log('Type:', type);
    
    // Obtener la URL base y construir redirección
    // Para auth/confirm siempre usar el dominio público si está disponible
    const forwardedHost = request.headers.get('x-forwarded-host');
    const forwardedProto = request.headers.get('x-forwarded-proto') || 'https';
    
    // Solo usar forwarded headers si realmente estamos detrás de un proxy
    const baseUrl = forwardedHost && forwardedHost !== 'localhost:3000' 
      ? `${forwardedProto}://${forwardedHost}`
      : request.nextUrl.origin;
    
    const redirectTo = new URL('/create-password', baseUrl);
    
    console.log('Forwarded host:', forwardedHost);
    console.log('Using base URL:', baseUrl);
    console.log('Redirect URL will be:', redirectTo.toString());

    if (token_hash && type) {
      console.log('Creating Supabase client...');
      const supabase = await createClient()

      console.log('Verifying OTP...');
      const { error } = await supabase.auth.verifyOtp({
        token_hash: token_hash!,
        type: type!
      })
      
      if (!error) {
        console.log('OTP verification successful, redirecting to create-password');
        return NextResponse.redirect(redirectTo.toString(), 302)
      } else {
        console.error('Error verifying OTP:', error)
        // Aún redirigir a create-password en caso de error menor
        return NextResponse.redirect(redirectTo.toString(), 302)
      }
    }

    console.log('Missing token_hash or type, redirecting to error page');
    // return the user to an error page with some instructions
    const errorRedirect = new URL('/error', baseUrl);
    return NextResponse.redirect(errorRedirect.toString(), 302)
  } catch (error) {
    console.error('Fatal error in auth/confirm:', error);
    
    // En caso de error fatal, redirigir a login usando el mismo baseUrl
    const forwardedHost = request.headers.get('x-forwarded-host');
    const forwardedProto = request.headers.get('x-forwarded-proto') || 'https';
    const baseUrl = forwardedHost && forwardedHost !== 'localhost:3000' 
      ? `${forwardedProto}://${forwardedHost}`
      : request.nextUrl.origin;
      
    const errorRedirect = new URL('/login', baseUrl);
    return NextResponse.redirect(errorRedirect.toString(), 302)
  }
}