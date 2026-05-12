import { Component, inject, input, signal, computed } from '@angular/core';
import { Header } from "../../../shared/header/header";
import { MatCard, MatCardContent, MatCardActions, MatCardHeader, MatCardTitle, MatCardSubtitle } from "@angular/material/card";
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ConsultarUbicacionService, UbicacionItem } from './services/consultar-ubicacion.service';
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import { switchMap, of, startWith, finalize, catchError, tap } from 'rxjs';
import { LoaderPage } from "../../../shared/loader-page/loader-page";
import { MatRadioGroup, MatRadioButton } from "@angular/material/radio";
import { MatIcon } from "@angular/material/icon";
import { SweetAlertService } from '../../../shared/alert/services/sweet-alert.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-consultar-ubicacion',
  imports: [Header, MatCard, MatCardContent,
    ReactiveFormsModule, LoaderPage, MatRadioGroup, MatRadioButton, FormsModule, MatCardActions, MatCardHeader, MatCardTitle, MatIcon, MatCardSubtitle],
  templateUrl: './consultar-ubicacion.html',
  styleUrl: './consultar-ubicacion.scss',
})
export class ConsultarUbicacion {

  // DI
  private consultarUbicacionService = inject(ConsultarUbicacionService);
  private sweetAlert = inject(SweetAlertService);
  private router = inject(Router);

  // estados
  ubicacion = input<string>();
  protected readonly isLoading = signal(false);
  protected readonly error = signal<string | null>(null);


  // data desde backend
  private response$ = toObservable(this.ubicacion).pipe(
    switchMap(ub => {
      if (!ub) return of({ Items: [] });

      this.isLoading.set(true);

      return this.consultarUbicacionService.getContenidoUbicacion(ub).pipe(
        tap({
          next: (response) => {
            console.log(response);
          },
          error: (error: any) => {
            console.error(error);
            this.sweetAlert.error('Error', 'Ocurrió un error al consultar la ubicación');
          }
        }),
        catchError(() => of({ Items: [] })),
        finalize(() => this.isLoading.set(false))
      );
    }),
    startWith({ Items: [] })
  );

  response = toSignal(this.response$, {
    initialValue: { Items: [] }
  });

  // datos planos
  data = computed<UbicacionItem[]>(() => this.response()?.Items ?? []);

  // bodegas únicas
  bodegas = computed(() => {
    return Array.from(new Set(this.data().map(x => x.CodBodega)));
  });

  // filtro seleccionado
  bodegaSeleccionada = signal<string | null>(null);

  // 🔹 data filtrada
  dataFiltrada = computed(() => {
    const bodega = this.bodegaSeleccionada();
    if (!bodega) return this.data();

    return this.data().filter(x => x.CodBodega === bodega);
  });

  verDetalleLote(lote: string, codArticulo: string) {
    //redirigir a la pantalla de consulta de lote
    this.router.navigate(['/consultaLote'], {
      queryParams: {
        lote: lote,
        codArticulo: codArticulo
      }
    });
  }
}

