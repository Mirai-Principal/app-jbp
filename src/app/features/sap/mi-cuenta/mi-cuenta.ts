import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
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
import { finalize, skip } from 'rxjs/operators';
import { UserService } from '../../../core/services/user.service';
import { Header } from '../../../shared/header/header';
import { MiCuentaService } from './mi-cuenta.service';

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
export class MiCuenta implements OnInit {
  private readonly userService = inject(UserService);
  private readonly miCuentaService = inject(MiCuentaService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly userData = signal<CurrentUserInfo | null>(
    this.normalizeUser(this.userService.currentUserValue)
  );
  protected readonly codigoImpresora = signal<string | null>(null);
  protected readonly isLoadingCodigo = signal<boolean>(false);

  constructor() {
    this.userService.currentUser
      .pipe(skip(1), takeUntilDestroyed(this.destroyRef))
      .subscribe((user) => {
        this.userData.set(this.normalizeUser(user));
        this.cargarCodigoImpresora();
      });
  }

  ngOnInit(): void {
    this.cargarCodigoImpresora();
  }

  cargarCodigoImpresora(): void {
    const username = this.userData()?.UserName?.trim();
    if (!username) {
      this.codigoImpresora.set(null);
      return;
    }

    this.isLoadingCodigo.set(true);
    this.miCuentaService
      .getCodigoImpresoraByUser(username)
      .pipe(
        finalize(() => this.isLoadingCodigo.set(false)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (res) => {
          this.codigoImpresora.set(res?.codigoImpresora ?? null);
        },
        error: () => {
          this.codigoImpresora.set(null);
        },
      });
  }

  private normalizeUser(user: any): CurrentUserInfo | null {
    if (user && typeof user === 'object' && Object.keys(user).length > 0) {
      return user as CurrentUserInfo;
    }
    return null;
  }
}
