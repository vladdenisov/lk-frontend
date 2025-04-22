import { redirect } from "next/navigation";
import { apiRequest } from "./api";
import { CurrentUser } from "@/types/user";

/**
 * Fetches the current user's profile information.
 * Handles errors and redirects based on the redirectOnError flag.
 *
 * @param redirectOnError If true (default), redirects to login on error (e.g., 401).
 *                        If false, returns null on error.
 * @returns The CurrentUser object or null.
 */
export async function getCurrentUser(
  redirectOnError: boolean = true
): Promise<CurrentUser | null> {
  try {
    // Use apiRequest to fetch the profile. The endpoint returns the user object directly.
    // Set redirectMode to 'manual' if we don't want apiRequest to automatically redirect.
    const user = await apiRequest<CurrentUser>(
      'auth/profile', 
      { method: 'GET' }, 
      redirectOnError ? 'auto' : 'manual' // Control redirection behavior in apiRequest
    );
    console.log("Current user fetched:", user);
    return user;
  } catch (error: any) {
    console.error("Failed to get current user:", error.message);
    // If redirectOnError is false and an error occurred (e.g., 401, 403 handled manually),
    // apiRequest would have thrown an error, so we catch it and return null.
    if (!redirectOnError) {
      return null;
    }
    // If redirectOnError is true, apiRequest should have already handled the redirect
    // for common cases (401, 403). If some other error occurred, we might still end up here.
    // We'll return null, but a redirect might have already happened or might be needed.
    // Consider if a redirect is necessary here for unexpected errors when redirectOnError=true.
    // For now, rely on apiRequest's 'auto' mode redirect.
    return null; 
  }
}

/**
 * Requires authentication for a page or component.
 * Fetches the current user and redirects to login if not found.
 *
 * @returns The CurrentUser object.
 * @throws Redirects to login if user is not authenticated.
 */
export async function requireAuth(): Promise<CurrentUser> {
  // getCurrentUser with redirectOnError=true will handle the redirect
  const user = await getCurrentUser(true);

  if (!user) {
    // This part might be redundant if getCurrentUser always redirects on failure when redirectOnError=true,
    // but it acts as a safeguard.
    console.log('RequireAuth: User not found after getCurrentUser, redirecting...');
    redirect("/auth/login"); 
  }
  
  return user;
} 