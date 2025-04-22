import { apiRequest } from "./api";

/**
 * Proxy a request through your backend's /servers/proxy endpoint.
 *
 * @template T  The expected shape of the JSON response.
 * @param url     The backend-relative URL to proxy, e.g. "/resources/employees"
 * @param method  The HTTP method to use for that proxied request, e.g. "GET", "POST"
 * @param data    An arbitrary payload object (will be JSON‑stringified; omit for no body)
 * @returns       The parsed JSON response of type T
 */
export async function callProxy<T>(
  url: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  data?: any,
  redirectOnError?: boolean
): Promise<T> {
  // Build the proxy payload exactly as your NestJS proxy expects
  const payload = {
    url,
    mode: method,
    data: data != null ? JSON.stringify(data) : "",
  };

  // Delegate to apiRequest, which handles cookies, env, redirects, etc.
  return apiRequest<T>("servers/proxy", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  }, redirectOnError ? "manual" : "auto");
}
