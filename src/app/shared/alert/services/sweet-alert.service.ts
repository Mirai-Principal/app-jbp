import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Alert } from '../alert';
import { Observable } from 'rxjs';

export interface SweetAlertOptions {
  title: string;
  message?: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  confirmButtonText?: string;
  cancelButtonText?: string;
  showCancelButton?: boolean;
  showConfirmButton?: boolean;
  isLoading?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class SweetAlertService {
  constructor(private dialog: MatDialog) { }

  // Alertas simples
  success(title: string, message?: string): Observable<boolean> {
    return this.show({
      title,
      message,
      type: 'success'
    });
  }

  error(title: string, message?: string): Observable<boolean> {
    return this.show({
      title,
      message,
      type: 'error'
    });
  }

  warning(title: string, message?: string): Observable<boolean> {
    return this.show({
      title,
      message,
      type: 'warning'
    });
  }

  info(title: string, message?: string): Observable<boolean> {
    return this.show({
      title,
      message,
      type: 'info'
    });
  }

  // Alerta personalizada
  show(options: SweetAlertOptions): Observable<boolean> {
    const dialogRef = this.dialog.open(Alert, {
      data: {
        title: options.title,
        message: options.message || '',
        type: options.type || 'info',
        confirmButtonText: options.confirmButtonText || 'OK',
        cancelButtonText: options.cancelButtonText || 'Cancelar',
        showCancelButton: options.showCancelButton || false,
        showConfirmButton: options.showConfirmButton !== false,
        isLoading: options.isLoading || false
      },
      disableClose: true,
      panelClass: 'sweet-alert-dialog'
    });

    return dialogRef.afterClosed();
  }

  // Confirmación con botones
  confirm(options: SweetAlertOptions): Observable<boolean> {
    return this.show({
      ...options,
      showCancelButton: true,
      confirmButtonText: options.confirmButtonText || 'Confirmar',
      cancelButtonText: options.cancelButtonText || 'Cancelar'
    });
  }

  // Alerta con loading
  loading(title: string, message?: string): Observable<boolean> {
    return this.show({
      title,
      message,
      type: 'info',
      isLoading: true,
      showConfirmButton: false,
      showCancelButton: false
    });
  }

  // Cerrar todas las alertas
  closeAll(): void {
    this.dialog.closeAll();
  }
}
