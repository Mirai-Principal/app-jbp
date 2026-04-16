// no-auth.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const noAuthGuard: CanActivateFn = () => {
    const router = inject(Router);

    const isAuthenticated = localStorage.getItem('Nombre') !== null;

    if (isAuthenticated) {
        router.navigate(['/directorio']);
        return false;
    }

    return true;
};