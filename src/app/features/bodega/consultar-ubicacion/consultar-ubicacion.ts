import { Component, inject, input, signal, computed, effect, ViewChild } from '@angular/core';
import { Header } from "../../../shared/header/header";
import { MatCard, MatCardContent, MatCardActions, MatCardHeader, MatCardTitle } from "@angular/material/card";
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Table } from '../../../shared/table/table';
import { MatTableDataSource } from '@angular/material/table';
import { ConsultarUbicacionService, UbicacionItem } from './services/consultar-ubicacion.service';
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import { switchMap, of, startWith, finalize, catchError, tap } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { LoaderPage } from "../../../shared/loader-page/loader-page";
import { MatPaginator } from '@angular/material/paginator';
import { MatRadioGroup, MatRadioButton } from "@angular/material/radio";
import { MatIcon } from "@angular/material/icon";
import { ConsultaLote } from "../consulta-lote/consulta-lote";
import { SweetAlertService } from '../../../shared/alert/services/sweet-alert.service';

@Component({
  selector: 'app-consultar-ubicacion',
  imports: [Header, MatCard, MatCardContent,
    ReactiveFormsModule, Table, LoaderPage, MatRadioGroup, MatRadioButton, FormsModule, MatCardActions, MatCardHeader, MatCardTitle, MatIcon],
  templateUrl: './consultar-ubicacion.html',
  styleUrl: './consultar-ubicacion.scss',
})
export class ConsultarUbicacion {

  // DI
  private consultarUbicacionService = inject(ConsultarUbicacionService);
  private dialog = inject(MatDialog);
  private sweetAlert = inject(SweetAlertService);

  // estados
  ubicacion = input<string>();
  protected readonly isLoading = signal(false);
  protected readonly error = signal<string | null>(null);

  // columnas
  displayedColumns = ['Lote', 'Bodega', 'CodArticulo', 'Articulo', 'Cantidad'];

  tableColumns = [
    { columnDef: 'Lote', header: 'Lote' },
    { columnDef: 'Bodega', header: 'Bodega' },
    { columnDef: 'CodArticulo', header: 'CodArticulo' },
    { columnDef: 'Articulo', header: 'Articulo' },
    { columnDef: 'Cantidad', header: 'Cantidad' },
  ];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  dataSource: MatTableDataSource<UbicacionItem> = new MatTableDataSource<UbicacionItem>([]);

  // data desde backend
  private response$ = toObservable(this.ubicacion).pipe(
    switchMap(ub => {
      if (!ub) return of({ Items: [] });

      this.isLoading.set(true);

      return this.consultarUbicacionService.getContenidoUbicacion(ub).pipe(
        tap({
          next: (response) => {
            console.log(response);
            this.dataSource.data = response.Items;
            // Use setTimeout to ensure paginator is properly initialized
            setTimeout(() => {
              this.dataSource.paginator = this.paginator;
            }, 0);
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
    this.dialog.open(ConsultaLote, {
      data: { lote, codArticulo },
    });
  }
}

