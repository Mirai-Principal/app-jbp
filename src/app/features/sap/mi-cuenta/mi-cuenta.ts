import { Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  MatCard,
  MatCardAvatar,
  MatCardContent,
  MatCardHeader,
  MatCardSubtitle,
  MatCardTitle,
} from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { UserService } from '../../../core/services/user.service';
import { Header } from '../../../shared/header/header';

export interface CurrentUserInfo {
  Nombre?: string;
  UserName?: string;
  codigoImpresora?: string;
  correo?: string;
}

@Component({
  selector: 'app-mi-cuenta',
  imports: [
    Header,
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardSubtitle,
    MatCardAvatar,
    MatCardContent,
    MatListModule,
    MatDividerModule,
    MatIconModule,
  ],
  templateUrl: './mi-cuenta.html',
  styleUrl: './mi-cuenta.scss',
})
export class MiCuenta {
  private readonly userService = inject(UserService);

  protected readonly userData = signal<CurrentUserInfo | null>(this.loadUserFromStorage());

  protected readonly userInitials = computed(() => {
    const nombre = this.userData()?.Nombre?.trim();
    if (!nombre) return 'U';
    const parts = nombre.split(/\s+/);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return nombre.slice(0, 2).toUpperCase();
  });

  constructor() {
    this.userService.currentUser.pipe(takeUntilDestroyed()).subscribe(() => {
      this.userData.set(this.loadUserFromStorage());
    });
  }

  private loadUserFromStorage(): CurrentUserInfo | null {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return null;
    }

    try {
      const raw = localStorage.getItem('currentUser');
      if (!raw) return null;

      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object' && Object.keys(parsed).length > 0) {
        return parsed as CurrentUserInfo;
      }
      return null;
    } catch (error) {
      console.error('Error al leer currentUser de localStorage:', error);
      return null;
    }
  }
}
