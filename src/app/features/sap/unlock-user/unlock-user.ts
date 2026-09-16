import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Header } from '../../../shared/header/header';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UnlockUserServices } from './unlock-user.service';
import { SweetAlertService } from '../../../shared/alert/services/sweet-alert.service';
import { UserActionResult } from './unlock-user.model';

@Component({
  selector: 'app-unlock-user',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    Header,
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatCardTitle,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIcon,
    MatProgressSpinnerModule,
  ],
  templateUrl: './unlock-user.html',
  styleUrl: './unlock-user.scss',
})
export class UnlockUser {
  // DI
  private readonly fb = inject(FormBuilder);
  private readonly unlockService = inject(UnlockUserServices);
  private readonly sweetAlert = inject(SweetAlertService);

  // Estados reactivos
  readonly isProcessing = signal<boolean>(false);
  readonly lastResult = signal<UserActionResult | null>(null);
  private resultTimer: any;

  // variables privadas
  private readonly currentUser = localStorage.getItem('currentUser');
  readonly ModulosAcceso = JSON.parse(this.currentUser || '{}')?.ModulosAcceso || {};

  // Formulario
  readonly form: FormGroup = this.fb.group({
    userCode: ['', [Validators.required, Validators.pattern(/\S+/)]],
  });

  onUnlock(): void {
    const userCode = this.cleanUserCode();
    if (!userCode) {
      this.sweetAlert.warning('Campo requerido', 'Por favor ingresa tu código de usuario de SAP.');
      return;
    }

    this.sweetAlert
      .confirm({
        title: 'Confirmar Desbloqueo',
        message: `¿Estás seguro de desbloquear el acceso para "${userCode}" en SAP?`,
        type: 'warning',
        confirmButtonText: 'Sí, desbloquear',
        cancelButtonText: 'Cancelar',
      })
      .subscribe((confirmed) => {
        if (!confirmed) return;
        this.executeUnlock(userCode);
      });
  }

  onLock(): void {
    const userCode = this.cleanUserCode();
    if (!userCode) {
      this.sweetAlert.warning('Campo requerido', 'Por favor ingresa tu código de usuario de SAP.');
      return;
    }

    this.sweetAlert
      .confirm({
        title: 'Confirmar Bloqueo',
        message: `¿Estás seguro de BLOQUEAR el acceso para "${userCode}" en SAP?`,
        type: 'warning',
        confirmButtonText: 'Sí, bloquear',
        cancelButtonText: 'Cancelar',
      })
      .subscribe((confirmed) => {
        if (!confirmed) return;
        this.executeLock(userCode);
      });
  }

  private executeUnlock(userCode: string): void {
    this.isProcessing.set(true);
    this.unlockService.unlockUser(userCode).subscribe({
      next: (res) => {
        this.isProcessing.set(false);
        const result = res?.data || { internalKey: 0, userCode, status: 'unlocked' };
        this.showResultTemporarily(result);

        this.sweetAlert.success(
          'Usuario Desbloqueado',
          `El usuario "${userCode}" fue desbloqueado exitosamente en SAP.`
        );
      },
      error: (err) => {
        console.log(err);
        this.isProcessing.set(false);
        const msg = err?.error?.error || err?.error?.message || err?.message || 'Error desconocido';
        this.sweetAlert.error('Error al desbloquear', msg);
      },
    });
  }

  private executeLock(userCode: string): void {
    this.isProcessing.set(true);
    this.unlockService.lockUser(userCode).subscribe({
      next: (res) => {
        this.isProcessing.set(false);
        const result = res?.data || { internalKey: 0, userCode, status: 'locked' };
        this.showResultTemporarily(result);

        this.sweetAlert.success(
          'Usuario Bloqueado',
          `El usuario "${userCode}" fue bloqueado exitosamente en SAP.`
        );
      },
      error: (err) => {
        console.log(err);
        this.isProcessing.set(false);
        const msg = err?.error?.error || err?.error?.message || err?.message || 'Error desconocido';
        this.sweetAlert.error('Error al bloquear', msg);
      },
    });
  }

  private cleanUserCode(): string {
    return (this.form.get('userCode')?.value || '').trim();
  }

  private showResultTemporarily(result: UserActionResult): void {
    this.lastResult.set(result);
    if (this.resultTimer) {
      clearTimeout(this.resultTimer);
    }
    this.resultTimer = setTimeout(() => {
      this.lastResult.set(null);
    }, 5000);
  }
}
