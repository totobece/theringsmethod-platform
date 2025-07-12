import { type EmailOtpType } from '@supabase/supabase-js'
import { type NextRequest, NextResponse } from 'next/server'

import { createClient } from '@/utils/supabase/server'

// Creating a handler to a GET request to route /auth/confirm
export async function GET(request: NextRequest) {
  try {    console.log('Auth confirm called with URL:', request.url);

    const { searchParams } = new URL(request.url)
    const token_hash = searchParams.get('token_hash')
    const type = searchParams.get('type') as EmailOtpType | null

    console.log('Token hash present:', !!token_hash);
    console.log('Type:', type);
    
    // Determinar la URL base correcta para redirección
    const host = request.headers.get('host');
    const forwardedHost = request.headers.get('x-forwarded-host');
    const forwardedProto = request.headers.get('x-forwarded-proto') || 'https';
    
    let baseUrl: string;
    
    // Si el host contiene el dominio de producción, usar https
    if (host && host.includes('theringsmethod.com')) {
      baseUrl = `https://${host}`;
      console.log('Using production domain from host:', baseUrl);
    }
    // Si tenemos headers de proxy válidos, usarlos
    else if (forwardedHost && forwardedHost.includes('theringsmethod.com')) {
      baseUrl = `${forwardedProto}://${forwardedHost}`;
      console.log('Using forwarded headers:', baseUrl);
    }
    // Fallback a la URL original
    else {
      baseUrl = request.nextUrl.origin;
      console.log('Using fallback origin:', baseUrl);
    }
    
    const redirectTo = new URL('/create-password', baseUrl);
    console.log('Final redirect URL will be:', redirectTo.toString());

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
        
        // En lugar de redireccionar, devolver HTML que haga redirect via JavaScript
        const redirectHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Redirecting...</title>
          <script>
            window.location.href = '${redirectTo.toString()}';
          </script>
        </head>
        <body>
          <p>Redirecting to create password page...</p>
          <p>If you are not redirected automatically, <a href="${redirectTo.toString()}">click here</a>.</p>
        </body>
        </html>
        `;
        
        return new Response(redirectHtml, {
          status: 200,
          headers: { 
            'Content-Type': 'text/html',
            'Cache-Control': 'no-cache, no-store, must-revalidate'
          },
        });
      } else {
        console.error('Error verifying OTP:', error);
        console.error('Error code:', error.code);
        console.error('Error status:', error.status);
        
        // Si el token expiró o es inválido, redirigir a error
        if (error.code === 'otp_expired' || error.code === 'otp_invalid') {
          console.log('Token expired/invalid, redirecting to login with error');
          const errorRedirect = new URL('/login?error=link_expired', baseUrl);
          return NextResponse.redirect(errorRedirect.toString(), 302);
        }
        
        // Para otros errores, aún intentar redirigir a create-password
        return NextResponse.redirect(redirectTo.toString(), 302)
      }
    }

    console.log('Missing token_hash or type, redirecting to error page');
    // return the user to an error page with some instructions
    const errorRedirect = new URL('/error', baseUrl);
    return NextResponse.redirect(errorRedirect.toString(), 302)
  } catch (error) {
    console.error('Fatal error in auth/confirm:', error);
    
    // En caso de error fatal, redirigir a login usando la misma lógica de baseUrl
    const host = request.headers.get('host');
    const forwardedHost = request.headers.get('x-forwarded-host');
    const forwardedProto = request.headers.get('x-forwarded-proto') || 'https';
    
    let baseUrl: string;
    if (host && host.includes('theringsmethod.com')) {
      baseUrl = `https://${host}`;
    } else if (forwardedHost && forwardedHost.includes('theringsmethod.com')) {
      baseUrl = `${forwardedProto}://${forwardedHost}`;
    } else {
      baseUrl = request.nextUrl.origin;
    }
      
    const errorRedirect = new URL('/login?error=auth_error', baseUrl);
    return NextResponse.redirect(errorRedirect.toString(), 302)
  }
}