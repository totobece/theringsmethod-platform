import { type EmailOtpType } from '@supabase/supabase-js'
import { type NextRequest } from 'next/server'

import { createClient } from '@/utils/supabase/server'

// Creating a handler to a GET request to route /auth/confirm
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null

  // Determinar la URL base para redirección
  const host = request.headers.get('host') || '';
  const forwardedHost = request.headers.get('x-forwarded-host') || '';
  
  let baseUrl = 'https://app.theringsmethod.com';
  if (host.includes('theringsmethod.com')) {
    baseUrl = `https://${host}`;
  } else if (forwardedHost.includes('theringsmethod.com')) {
    baseUrl = `https://${forwardedHost}`;
  }
  
  const redirectUrl = `${baseUrl}/create-password`;

  // Respuesta HTML mínima para evitar headers grandes
  const createHtmlResponse = (targetUrl: string, message: string = 'Redirecting...') => {
    const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><script>location.href='${targetUrl}'</script></head><body><p>${message}</p><a href="${targetUrl}">Click here if not redirected</a></body></html>`;
    
    // Usar Response básica sin headers adicionales de Next.js
    return new Response(html, {
      status: 200,
      headers: new Headers({
        'content-type': 'text/html; charset=utf-8'
      })
    });
  };

  if (!token_hash || !type) {
    return createHtmlResponse(`${baseUrl}/error`, 'Invalid confirmation link');
  }

  try {
    const supabase = await createClient()
    const { error } = await supabase.auth.verifyOtp({
      token_hash,
      type
    })
    
    if (error) {
      console.error('OTP verification error:', error.code);
      if (error.code === 'otp_expired' || error.code === 'otp_invalid') {
        return createHtmlResponse(`${baseUrl}/login?error=link_expired`, 'Link expired');
      }
    }
    
    // Redirigir a create-password independientemente del resultado
    return createHtmlResponse(redirectUrl, 'Redirecting to create password...');
    
  } catch (error) {
    console.error('Auth confirm error:', error);
    return createHtmlResponse(`${baseUrl}/login?error=auth_error`, 'Authentication error');
  }
}