import { Component, computed, inject, input, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { ConsultaLoteService } from './services/consulta-lote.service';
import { of } from 'rxjs';
import { catchError, finalize, startWith, switchMap, tap } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { MatIcon } from "@angular/material/icon";
import { LoaderPage } from "../../../shared/loader-page/loader-page";
import { SweetAlertService } from '../../../shared/alert/services/sweet-alert.service';

@Component({
  selector: 'app-consulta-lote',
  imports: [CommonModule, MatIcon, LoaderPage],
  templateUrl: './consulta-lote.html',
  styleUrl: './consulta-lote.scss',
})
export class ConsultaLote {
  // DI
  private consultaLoteService = inject(ConsultaLoteService);
  private sweetAlert = inject(SweetAlertService);

  // Datos del diálogo como signals
  lote = input<string>('');
  codArticulo = input<string | undefined>(undefined);

  // 🔹 loading
  protected readonly isLoading = signal(false);

  // data desde backend
  private response$ = toObservable(this.lote).pipe(
    switchMap(lote => {
      if (!lote) return of({} as any);

      this.isLoading.set(true);

      return this.consultaLoteService.getContenidoLote(lote, this.codArticulo()).pipe(
        tap({
          next: (response) => {
            console.log("respuesta", response);
          },
          error: (error: any) => {
            this.sweetAlert.error('Error', 'Error al obtener los datos');
            console.error("Error al obtener los datos: " + error);
          }
        }),
        catchError(() => of({} as any)),
        finalize(() => this.isLoading.set(false))
      );
    }),
    startWith({} as any)
  );

  response = toSignal(this.response$, {
    initialValue: {} as any
  });

  // 🔹 datos derivados
  detalleLote = computed(() => this.response());
  esProductoTerminado = computed(() => !!this.detalleLote()?.EsPT);

  estadoLote = computed(() => {
    const estado = this.detalleLote()?.Estado;

    switch (estado) {
      case 'Liberado':
        return 'APROBADO';
      case 'Acceso Denegado':
        return 'CUARENTENA';
      case 'Bloqueado':
        return 'RECHAZADO';
      default:
        return '';
    }
  });


}
