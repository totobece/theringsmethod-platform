import { NextRequest } from 'next/server';

/**
 * Obtiene la URL base correcta considerando headers de proxy
 * Útil para aplicaciones detrás de nginx u otros proxies
 */
export function getBaseUrl(request: NextRequest): string {
  const forwardedHost = request.headers.get('x-forwarded-host');
  const forwardedProto = request.headers.get('x-forwarded-proto') || 'https';
  
  if (forwardedHost) {
    return `${forwardedProto}://${forwardedHost}`;
  }
  
  // Fallback a la URL original del request
  return request.nextUrl.origin;
}

/**
 * Crea una URL de redirección usando la base correcta
 */
export function createRedirectUrl(request: NextRequest, path: string): URL {
  const baseUrl = getBaseUrl(request);
  return new URL(path, baseUrl);
}
