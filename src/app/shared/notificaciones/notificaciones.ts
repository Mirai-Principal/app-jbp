import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { Modal } from '../modal/modal';

export interface NotificacionAviso {
  id: string;
  titulo: string;
  subtitulo?: string;
  imagen?: string;
  descripcion: string;
  rutaAccion?: string;
  textoAccion?: string;
  /** Fecha límite de visualización en formato 'YYYY-MM-DD' (hasta 23:59:59) o 'YYYY-MM-DDTHH:mm:ss'. Omitir para no expirar. */
  fechaFin?: string;
}

@Component({
  selector: 'app-notificaciones',
  imports: [CommonModule, Modal, MatButtonModule, MatIconModule],
  templateUrl: './notificaciones.html',
  styleUrl: './notificaciones.scss',
})
export class Notificaciones implements OnInit {
  private readonly router = inject(Router);

  private readonly notificacionesDisponibles: NotificacionAviso[] = [
    {
      id: 'notificacion_clave_impresora_v1',    //cambiar cuando se genere una nueva notificacion
      titulo: '¡Consulta tu Clave de Impresora!',
      subtitulo: 'Aviso importante',
      imagen: 'notificacion.jpg',
      descripcion:
        'Si deseas saber cuál es tu clave o código de impresora asignado, puedes consultarlo ingresando en la sección SAP y seleccionando la opción "Mi Cuenta".',
      rutaAccion: '/mi-cuenta',
      textoAccion: 'Ver Mi Cuenta',
      fechaFin: '2026-11-30', // Formato 'YYYY-MM-DD' o 'YYYY-MM-DDTHH:mm:ss'
    },
  ];

  private pendientes: NotificacionAviso[] = [];
  protected readonly notificacionActual = signal<NotificacionAviso | null>(null);
  protected readonly isOpen = signal<boolean>(false);

  ngOnInit(): void {
    this.cargarPendientes();
  }

  private cargarPendientes(): void {
    if (typeof localStorage === 'undefined') return;

    const ahora = new Date();
    this.pendientes = this.notificacionesDisponibles.filter(
      (notif) =>
        this.estaVigente(notif, ahora) &&
        !localStorage.getItem(this.getStorageKey(notif.id))
    );

    if (this.pendientes.length > 0) {
      this.mostrarSiguiente();
    }
  }

  private estaVigente(notif: NotificacionAviso, ahora: Date): boolean {
    if (!notif.fechaFin) return true;

    const trimmed = notif.fechaFin.trim();
    const soloFechaMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(trimmed);
    const limite = soloFechaMatch
      ? new Date(
          Number(soloFechaMatch[1]),
          Number(soloFechaMatch[2]) - 1,
          Number(soloFechaMatch[3]),
          23,
          59,
          59,
          999
        )
      : new Date(trimmed);

    if (isNaN(limite.getTime())) {
      console.warn(`Fecha fin inválida en notificación "${notif.id}": ${notif.fechaFin}`);
      return true;
    }

    return ahora.getTime() <= limite.getTime();
  }

  private mostrarSiguiente(): void {
    const siguiente = this.pendientes.shift() ?? null;
    this.notificacionActual.set(siguiente);
    this.isOpen.set(siguiente !== null);
  }

  cerrarNotificacion(): void {
    const actual = this.notificacionActual();
    if (actual) {
      this.marcarComoVista(actual.id);
    }

    this.isOpen.set(false);
    this.notificacionActual.set(null);

    if (this.pendientes.length > 0) {
      setTimeout(() => this.mostrarSiguiente(), 200);
    }
  }

  irAAccion(ruta: string): void {
    const actual = this.notificacionActual();
    if (actual) {
      this.marcarComoVista(actual.id);
    }

    this.pendientes = [];
    this.isOpen.set(false);
    this.notificacionActual.set(null);
    this.router.navigate([ruta]);
  }

  private marcarComoVista(id: string): void {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(this.getStorageKey(id), 'true');
  }

  private getStorageKey(id: string): string {
    let userKey = 'default';
    try {
      const rawUser = localStorage.getItem('currentUser');
      if (rawUser) {
        const parsed = JSON.parse(rawUser);
        userKey = parsed?.UserName || parsed?.Nombre || 'default';
      } else {
        userKey = localStorage.getItem('Nombre') || 'default';
      }
    } catch {
      userKey = localStorage.getItem('Nombre') || 'default';
    }
    return `jbp_notif_${id}_${userKey}`;
  }
}
