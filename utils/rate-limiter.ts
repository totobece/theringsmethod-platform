// Rate limiter simple para APIs
const requestCounts = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60000; // 1 minuto
const MAX_REQUESTS = 30; // Máximo 30 requests por minuto por usuario

export function checkRateLimit(userId: string): boolean {
  const now = Date.now();
  const userLimit = requestCounts.get(userId);
  
  if (!userLimit || now > userLimit.resetTime) {
    // Reset o primera vez
    requestCounts.set(userId, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW
    });
    return true;
  }
  
  if (userLimit.count >= MAX_REQUESTS) {
    return false; // Rate limit excedido
  }
  
  userLimit.count++;
  return true;
}

export function getRateLimitStatus(userId: string) {
  const userLimit = requestCounts.get(userId);
  if (!userLimit) {
    return { count: 0, remaining: MAX_REQUESTS, resetTime: Date.now() + RATE_LIMIT_WINDOW };
  }
  
  return {
    count: userLimit.count,
    remaining: Math.max(0, MAX_REQUESTS - userLimit.count),
    resetTime: userLimit.resetTime
  };
}
