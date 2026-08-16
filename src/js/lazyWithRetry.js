import { lazy } from 'react';

/**
 * Lazy component loader with automatic retry & cache busting for SPA deployments
 * Prevents "Failed to fetch dynamically imported module" errors after site updates
 */
export function lazyWithRetry(componentImport) {
  return lazy(async () => {
    const pageHasAlreadyBeenForceRefreshed = JSON.parse(
      window.sessionStorage.getItem('page_has_been_force_refreshed') || 'false'
    );

    try {
      return await componentImport();
    } catch (error) {
      if (!pageHasAlreadyBeenForceRefreshed) {
        // Assume that the user has an old version of the application and reload once
        window.sessionStorage.setItem('page_has_been_force_refreshed', 'true');
        window.location.reload();
        return { default: () => null };
      }

      // If still fails, try one more time before throwing
      try {
        const component = await componentImport();
        window.sessionStorage.setItem('page_has_been_force_refreshed', 'false');
        return component;
      } catch (retryError) {
        console.error('Lazy chunk load failed after retry:', retryError);
        throw retryError;
      }
    }
  });
}
