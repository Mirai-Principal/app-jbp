import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const ticsGuard: CanActivateFn = () => {
  const router = inject(Router);

  if (typeof localStorage === 'undefined') {
    return false;
  }

  try {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (currentUser?.ModulosAcceso?.tics === true) {
      return true;
    }
  } catch {
    // Si currentUser está corrupto, denegar acceso
  }

  return router.createUrlTree(['/unauthorized']);
};
