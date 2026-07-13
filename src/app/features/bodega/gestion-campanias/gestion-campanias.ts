import { Component, inject, signal } from '@angular/core';
import { Header } from '../../../shared/header/header';
import { MatCard, MatCardContent } from '@angular/material/card';
import { Table, TableColumn } from '../../../shared/table/table';
import { Modal } from '../../../shared/modal/modal';
import { GenerarPesajeCampania } from './components/generar-pesaje-campania/generar-pesaje-campania';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { PesajeCampaniaService } from './services/pesaje-campania.service';
import { CommonModule, DatePipe, formatDate } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Campania } from './models/models';
import { ModalService } from '../../../shared/modal/services/modal.service';
import { DetallesCampania } from "./components/detalles-campania/detalles-campania";
import { forkJoin, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, startWith, finalize, catchError, tap } from 'rxjs/operators';
import { LoaderPage } from "../../../shared/loader-page/loader-page";
import { MatProgressSpinner } from "@angular/material/progress-spinner";
import { SweetAlertService } from '../../../shared/alert/services/sweet-alert.service';
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from '@angular/material/core';
import { HelpModal } from "../../../shared/help-modal/help-modal";

@Component({
  imports: [
    Header,
    MatCard,
    MatCardContent,
    Table,
    Modal,
    GenerarPesajeCampania,
    MatIconModule,
    MatButtonModule,
    CommonModule,
    DetallesCampania,
    LoaderPage,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatProgressSpinner,
    MatDatepickerModule,
    MatNativeDateModule,
    HelpModal
  ],
  providers: [DatePipe],
  templateUrl: './gestion-campanias.html',
  styleUrl: './gestion-campanias.scss',
})
export class GestionCampanias {
  // DI
  private pesajeCampaniaService = inject(PesajeCampaniaService);
  private datePipe = inject(DatePipe);
  modalService = inject(ModalService)
  private alertService = inject(SweetAlertService);

  // signals
  campanias = signal<Campania[]>([]);
  isModalOpen = signal(false);
  isLoading = signal(false);
  isSearching = signal(false);
  isSearchingDate = signal(false);
  searchControl = new FormControl('');
  dateRangeForm: FormGroup;

  // Detalles signal
  isDetallesModalOpen = signal(false);
  campaniaSeleccionada = signal<Campania | null>(null);

  columns: TableColumn[] = [
    { columnDef: 'Nombre', header: 'Nombre Campaña', cell: (element: Campania) => `${element.NOMBRE}` },
    { columnDef: 'FechaDesde', header: 'Fecha Desde', cell: (element: Campania) => this.datePipe.transform(element.FECHA_DESDE, 'dd/MM/yyyy', 'UTC') || '' },
    { columnDef: 'FechaHasta', header: 'Fecha Hasta', cell: (element: Campania) => this.datePipe.transform(element.FECHA_HASTA, 'dd/MM/yyyy', 'UTC') || '' },
    { columnDef: 'Estado', header: 'Estado', cell: (element: Campania) => element.FINALIZADA === undefined ? '' : (element.FINALIZADA ? 'Finalizada' : 'Activa') },
    { columnDef: 'Id', header: 'Acciones', cell: (element: Campania) => `${element.ID}` },
  ];
  displayedColumns: string[] = ['Nombre', 'FechaDesde', 'FechaHasta', 'Estado', 'Id',];

  constructor(private fb: FormBuilder) {
    this.dateRangeForm = this.fb.group({
      start: [null],
      end: [null]
    });

    this.dateRangeForm.valueChanges.subscribe(val => {
      if (val.start && val.end) {
        const startStr = formatDate(val.start, 'yyyy-MM-dd', 'en-US');
        const endStr = formatDate(val.end, 'yyyy-MM-dd', 'en-US');
        console.log(startStr, endStr);
        this.searchControl.reset('', { emitEvent: false });
        this.isSearchingDate.set(true);
        this.pesajeCampaniaService.buscarCampaniaPorFechas(startStr, endStr)
          .pipe(finalize(() => this.isSearchingDate.set(false)))
          .subscribe(res => {
            this.campanias.set(res);
            console.log(res);
            res.forEach((campania: Campania) => this.verificarEstadoCampania(campania));
          });
      } else if (!val.start && !val.end) {
        // Al limpiar las fechas, recarga todas las campañas directamente para evitar bloqueos
        this.searchControl.reset('', { emitEvent: false });
        this.pesajeCampaniaService.listaCampanias()
          .pipe(
            catchError(error => {
              this.alertService.error('Error', `❌ ${error.error.message}\n${error.error.error}`);
              console.error('Error al obtener campañas:', error);
              return of([]);
            })
          )
          .subscribe(res => {
            if (res) {
              this.campanias.set(res);
              res.forEach((campania: Campania) => this.verificarEstadoCampania(campania));
            }
          });
      }
    });

    this.searchControl.valueChanges.pipe(
      startWith(''),
      tap(value => {
        const termino = (value || '').trim();
        // Si el usuario escribe algo en el cuadro de búsqueda y hay fechas, limpiamos las fechas silenciosamente
        if (termino.length > 0 && (this.dateRangeForm.value.start || this.dateRangeForm.value.end)) {
          this.dateRangeForm.reset(null, { emitEvent: false });
        }
      }),
      debounceTime(500), // tiempo de espera antes de enviar la solicitud
      distinctUntilChanged(), // evitar solicitudes duplicadas
      switchMap(value => {
        const termino = (value || '').trim();
        this.isLoading.set(true);

        if (termino.length === 0) {
          // Cargar todas las campañas si no hay filtro
          return this.pesajeCampaniaService.listaCampanias().pipe(
            finalize(() => this.isLoading.set(false)),
            catchError(error => {
              this.alertService.error('Error', `❌ ${error.error.message}\n${error.error.error}`)
              console.error('Error al obtener campañas:', error);
              return of([]);
            })
          );
        }

        this.isLoading.set(false);
        if (termino.length < 3) {
          return of([])
        }

        this.isSearching.set(true);

        // Buscar campañas por nombre u OF
        return this.pesajeCampaniaService.buscarCampania_OF(termino).pipe(
          finalize(() => this.isSearching.set(false)),
          catchError((error) => {
            this.alertService.error('Error', `❌ ${error.error.message}\n${error.error.error}`)
            console.error('Error al buscar campañas:', error);
            return of([]);
          })
        );
      })
    ).subscribe(res => {
      this.campanias.set(res);
      res.forEach((campania: Campania) => this.verificarEstadoCampania(campania));
    });
  }

  cargarCampanias() {
    // Forzar actualización del stream reactivo para recargar los datos
    this.searchControl.setValue(this.searchControl.value);
  }

  verificarEstadoCampania(campania: Campania) {
    this.pesajeCampaniaService.obtenerCampania(campania.ID).subscribe(detalles => {
      if (detalles.length === 0) {
        campania.FINALIZADA = undefined;
        this.campanias.update(c => [...c]);
        return;
      }

      const ofRequests = detalles.map(d => this.pesajeCampaniaService.buscarOF(Number(d.NRO_OF)));
      forkJoin(ofRequests).subscribe(ofsResults => {
        const todasCerradas = ofsResults.every((res: any) => res.length > 0 && res[0].Estado === 'Cerrado');
        campania.FINALIZADA = todasCerradas;
        this.campanias.update(c => [...c]);
      });
    });
  }



  openModal() {
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
    this.cargarCampanias();
  }

  accionesDetalles(campania: Campania) {
    this.campaniaSeleccionada.set(campania);
    this.isDetallesModalOpen.set(true);
  }

  closeDetallesModal() {
    this.isDetallesModalOpen.set(false);
    this.campaniaSeleccionada.set(null);
  }

  onCampaniaEliminada() {
    this.closeDetallesModal();
    this.cargarCampanias();
  }

  onCampaniaActualizada(campania: Campania) {
    this.campaniaSeleccionada.set(campania);
    this.campanias.update(list => list.map(c => c.ID === campania.ID ? campania : c));
  }
}
