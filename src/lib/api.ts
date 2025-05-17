// lib/api.ts
import { redirect } from 'next/navigation'

// Track refresh token attempts to prevent infinite loops
let isRefreshing = false;
let refreshPromise: Promise<Response> | null = null;

/**
 * Universal API request helper.
 *
 * @template T  The expected response JSON shape.
 * @param url      Path under `/api/...` (client) or under BACKEND_URL (server), e.g. "posts/123"
 * @param init     Fetch options (method, headers, body, etc.)
 * @returns        Parsed JSON of type T
 */
export async function apiRequest<T>(
  url: string,
  init: RequestInit = {},
  redirectMode: 'auto' | 'manual' = 'auto'
): Promise<T> {
  const isServer = typeof window === 'undefined'
  let fullUrl: string
  const reqHeaders = new Headers(init.headers as HeadersInit)

  if (isServer) {
    // --- SERVER: ensure credentials are included ---
    fullUrl = `${process.env.BACKEND_URL!.replace(/\/$/, '')}/${url}`
    reqHeaders.set('cookie', (await import('next/headers').then(mod => mod.cookies().then(cookies => cookies.getAll().map(c => `${c.name}=${c.value}`).join('; ')))))
    init = {
      ...init,
      credentials: 'include',
    }
  } else {
    // --- CLIENT: call our Next.js proxy (rewrites in next.config.js) ---
    fullUrl = `/api/${url}`
    init = {
      ...init,
      credentials: 'include',
    }
  }

  console.log(reqHeaders)

  // shared helper to actually call fetch
  async function doFetch(): Promise<Response> {
    return fetch(fullUrl, {
      ...init,
      headers: reqHeaders,
      credentials: 'include', // Always include credentials
      cache: 'no-store',
    })
  }

  // 1) first attempt
  let res = await doFetch()

  // 2) handle 403 immediately
  if (res.status === 403) {
    console.log('403', res)
    throw new Error('Forbidden')
  }

  // 3) handle 401: try one refresh+retry on client
  if (res.status === 401 && !isServer) {
    // If we're already refreshing, wait for that to complete
    if (isRefreshing && refreshPromise) {
      await refreshPromise;
      // Retry the original request after refresh completes
      res = await doFetch();
    } else {
      // Start a new refresh
      isRefreshing = true;
      refreshPromise = fetch('/api/auth/refresh', {
        method: 'POST',
        credentials: 'include',
      });

      try {
        const refreshRes = await refreshPromise;
        if (refreshRes.ok) {
          console.log('Token refreshed successfully, retrying original request.');
          res = await doFetch();
        } else {
          console.error('Token refresh failed, redirecting to login.');
          if (redirectMode === 'auto') {
            window.location.href = '/auth/login';
          }
          throw new Error('Unauthorized: Refresh failed');
        }
      } finally {
        isRefreshing = false;
        refreshPromise = null;
      }
    }
  } else if (res.status === 401 && isServer) {
    if (redirectMode === 'auto') {
      console.log('Server-side 401, redirecting to login.');
      redirect('/auth/login');
    }
    throw new Error('Unauthorized');
  }

  // 4) if still not OK after potential retry, throw or handle as appropriate
  if (!res.ok) {
    if (res.status === 403) {
      throw new Error('Forbidden');
    }

    const errorText = await res.text().catch(() => res.statusText);
    console.error(`Request failed (${res.status}): ${errorText}`);
    throw new Error(`Request failed (${res.status}): ${errorText}`);
  }

  // 5) parse JSON if response is OK
  // Handle potential empty responses (e.g., 204 No Content)
  const contentType = res.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return (await res.json()) as T;
  } else {
    // Return null or an empty object if the response is not JSON or empty
    // Adjust based on expected non-JSON responses
    return null as T;
  }
}
