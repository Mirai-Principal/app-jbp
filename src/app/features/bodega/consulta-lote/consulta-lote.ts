import { Component, computed, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { ConsultaLoteService } from './services/consulta-lote.service';
import { of } from 'rxjs';
import { catchError, finalize, startWith, switchMap, tap } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatIcon } from "@angular/material/icon";
import { MatProgressSpinner } from "@angular/material/progress-spinner";

@Component({
  selector: 'app-consulta-lote',
  imports: [CommonModule, MatIcon, MatProgressSpinner],
  templateUrl: './consulta-lote.html',
  styleUrl: './consulta-lote.scss',
})
export class ConsultaLote {

  private consultaLoteService = inject(ConsultaLoteService);
  private dialog = inject(MatDialog);

  // Datos del diálogo como signals
  lote = signal<string>('');
  codArticulo = signal<string | undefined>(undefined);

  constructor() {
    const data = inject(MAT_DIALOG_DATA);
    this.lote.set(data.lote);
    this.codArticulo.set(data.codArticulo);

  }

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
