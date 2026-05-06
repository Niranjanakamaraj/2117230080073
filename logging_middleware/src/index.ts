export async function Log(stack: string, level: string, packageName: string, message: string): Promise<void> {
  const logEntry = {
    stack,
    level,
    package: packageName,
    message: message.substring(0, 48)
  };

  const isBrowser = typeof window !== 'undefined';
  const API_URL = isBrowser
    ? (process.env.NEXT_PUBLIC_TEST_SERVER_LOG_URL || '/evaluation-service/logs')
    : (process.env.TEST_SERVER_LOG_URL || 'http://20.207.122.201/evaluation-service/logs');
  
  // The API is a protected Route
  const token = (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_LOG_TOKEN) || 'placeholder-token';

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(logEntry),
    });

    if (!response.ok) {
       console.warn(`[Logging Middleware] Failed to send log to Test Server: ${response.statusText}`);
       console.log(`[Local Fallback]`, logEntry);
    }
  } catch (error) {
    console.warn(`[Logging Middleware] Network error sending log to Test Server:`, error);
    console.log(`[Local Fallback]`, logEntry);
  }
}
