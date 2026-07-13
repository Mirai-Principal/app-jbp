import { Component, Input, Output, EventEmitter, inject, OnInit, signal } from '@angular/core';
import { CommonModule, DatePipe, formatDate } from '@angular/common';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { Campania, CampaniaDetalles } from '../../models/models';
import { PesajeCampaniaService } from '../../services/pesaje-campania.service';
import { SweetAlertService } from '../../../../../shared/alert/services/sweet-alert.service';
import { Table, TableColumn } from '../../../../../shared/table/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DetallesOf } from '../detalles-of/detalles-of';
import { ButtonLoader } from '../../../../../shared/button-loader/button-loader';
import { forkJoin } from 'rxjs';
import { AgregarOfModal } from '../agregar-of-modal/agregar-of-modal';

@Component({
  selector: 'app-detalles-campania',
  imports: [
    CommonModule,
    MatCard,
    MatCardContent,
    MatIconModule,
    MatButtonModule,
    Table,
    MatProgressSpinnerModule,
    ButtonLoader,
    ReactiveFormsModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    AgregarOfModal
  ],
  providers: [DatePipe],
  templateUrl: './detalles-campania.html',
  styleUrl: './detalles-campania.scss',
})
export class DetallesCampania implements OnInit {
  @Input() campania!: Campania;
  @Output() campaniaEliminada = new EventEmitter<void>();
  @Output() campaniaActualizada = new EventEmitter<Campania>();

  private pesajeCampaniaService = inject(PesajeCampaniaService);
  private dialog = inject(MatDialog);
  private alertService = inject(SweetAlertService);
  private fb = inject(FormBuilder);

  detalles = signal<any[]>([]);
  isLoading = signal(true);
  isDeleting = signal(false);
  isEditing = signal(false);
  isUpdating = signal(false);
  isLoadingRows = signal(false);
  isModalAgregarOpen = signal(false);
  form: FormGroup;

  columns: TableColumn[] = [
    { columnDef: 'NRO_OF', header: 'Num. OF' },
    { columnDef: 'Lote', header: 'Lote' },
    { columnDef: 'Articulo', header: 'Articulo' },
    { columnDef: 'FechaInicio', header: 'Fecha de Inicio' },
    { columnDef: 'FechaFinalizacion', header: 'Fecha de Finalización' },
    { columnDef: 'FechaFabricacion', header: 'Fecha de Fabricación' },
    { columnDef: 'Estado', header: 'Estado' },
    { columnDef: 'Acciones', header: 'Acciones' }
  ];
  displayedColumns = [...this.columns.map(c => c.columnDef)];

  constructor() {
    this.form = this.fb.group({
      NombreCampania: ['', Validators.required],
      FechaDesde: ['', Validators.required],
      FechaHasta: ['', Validators.required]
    });
  }

  ngOnInit() {
    if (this.campania && this.campania.ID) {
      this.cargarDetalles(this.campania.ID);
    } else {
      this.isLoading.set(false);
    }
  }

  cargarDetalles(id: number) {
    this.pesajeCampaniaService.obtenerCampania(id).subscribe({
      next: (res) => {
        this.detalles.set(res);
        this.isLoading.set(false);
        this.verificarEstadoCampania();
      },
      error: (err) => {
        this.alertService.error('Error', `❌ ${err.error.message}\n${err.error.error}`);
        this.isLoading.set(false);
      }
    });
  }

  verificarEstadoCampania() {
    this.isLoadingRows.set(true);
    const detallesBase = this.detalles();
    if (detallesBase.length === 0) {
      this.campania.FINALIZADA = undefined;
      this.isLoadingRows.set(false);
      return;
    }
    const ofRequests = detallesBase.map(d => this.pesajeCampaniaService.buscarOF(Number(d.NRO_OF)));
    forkJoin(ofRequests).subscribe(ofsResults => {
      // Unir los datos básicos (ID_ST, NRO_OF) con la información completa de la OF
      const richDetalles = detallesBase.map((d, i) => {
        let ofData = ofsResults[i] && ofsResults[i].length > 0 ? ofsResults[i][0] : {};
        // Limpiar la porción de tiempo de las fechas para la tabla
        if (ofData.FechaFabricacion) ofData.FechaFabricacion = ofData.FechaFabricacion.split('T')[0];
        if (ofData.FechaFinalizacion) ofData.FechaFinalizacion = ofData.FechaFinalizacion.split('T')[0];
        if (ofData.FechaInicio) ofData.FechaInicio = ofData.FechaInicio.split('T')[0];
        return { ...d, ...ofData };
      });
      this.detalles.set(richDetalles);

      const todasCerradas = ofsResults.every((res: any) => res.length > 0 && res[0].Estado === 'Cerrado');
      this.campania.FINALIZADA = todasCerradas;
      this.isLoadingRows.set(false);
    });
  }

  abrirDetallesST(idST: number, nroOF: string) {
    this.dialog.open(DetallesOf, {
      width: '900px',
      maxWidth: '95vw',
      data: { idST, nroOF }
    });
  }

  eliminarOf(nroOf: string) {
    this.alertService.confirm({
      title: '¿Eliminar OF?',
      message: `¿Estás seguro de eliminar la OF ${nroOf} de esta campaña?`,
      type: 'warning'
    }).subscribe(isConfirmed => {
      if (isConfirmed) {
        this.isLoading.set(true);
        this.pesajeCampaniaService.eliminarOfDeCampania(nroOf, this.campania.ID).subscribe({
          next: (res) => {
            this.alertService.success('OF Eliminada', res.message);
            this.cargarDetalles(this.campania.ID);
          },
          error: (err) => {
            this.alertService.error('Error', `❌ ${err.error.message}\n${err.error.error}`);
            console.log(err);
            this.isLoading.set(false);
          }
        });
      }
    });
  }

  eliminarCampania() {
    this.alertService.confirm({
      title: '¿Estás seguro?',
      message: 'Esta acción eliminará la campaña permanentemente.',
      type: 'warning'
    }).subscribe(isConfirmed => {
      if (isConfirmed) {
        this.isDeleting.set(true);
        this.pesajeCampaniaService.eliminarCampania(this.campania.ID).subscribe({
          next: (res) => {
            this.alertService.success('Eliminado', res.message);
            this.isDeleting.set(false);
            this.campaniaEliminada.emit();
          },
          error: (err) => {
            this.alertService.error('Error', `❌ ${err.error.message}\n${err.error.error}`);
            console.log(err);
            this.isDeleting.set(false);
          }
        });
      }
    });
  }

  abrirModalAgregarOf() {
    this.isModalAgregarOpen.set(true);
  }

  cerrarModalAgregarOf() {
    this.isModalAgregarOpen.set(false);
  }

  onOfAgregada(ofDetalle: any) {
    if (ofDetalle) {
      // Verificar si ya existe en la campaña actual
      const existe = this.detalles().find(d => d.NRO_OF == ofDetalle.DocNum);
      if (existe) {
        this.alertService.warning('Aviso', '✅ La orden de fabricación ya existe en esta campaña');
        return;
      }

      this.isLoading.set(true);
      const payload = [{
        campaniaId: this.campania.ID.toString(),
        DocNum: ofDetalle.DocNum
      }];

      this.pesajeCampaniaService.crearDetalleCampania(payload).subscribe({
        next: (res) => {
          this.alertService.success('Agregado', res.message);
          this.cerrarModalAgregarOf();
          this.cargarDetalles(this.campania.ID);
        },
        error: (err) => {
          this.alertService.error('Error', `❌ ${err.error?.message}\n${err.error?.error || ''}`);
          this.isLoading.set(false);
        }
      });
    }
  }

  toggleEdit() {
    if (!this.isEditing()) {
      // Convertir '2026-07-11T00:00:00' a '2026/07/11' asegura que el Datepicker lo lea en horario local exacto
      const safeLocalDate = (dateStr: string) => {
        if (!dateStr) return '';
        const soloFecha = dateStr.split('T')[0];
        return new Date(soloFecha.replace(/-/g, '/')); // "2026/07/11" -> Parsea como Local
      };

      this.form.patchValue({
        NombreCampania: this.campania.NOMBRE,
        FechaDesde: safeLocalDate(this.campania.FECHA_DESDE),
        FechaHasta: safeLocalDate(this.campania.FECHA_HASTA)
      });
    }
    this.isEditing.set(!this.isEditing());
  }

  guardarEdicion() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.isUpdating.set(true);

    const fd = this.form.value.FechaDesde;
    const fh = this.form.value.FechaHasta;

    const datos = {
      NombreCampania: this.form.value.NombreCampania,
      FechaDesde: fd ? formatDate(fd, 'yyyy-MM-dd', 'en-US') : '',
      FechaHasta: fh ? formatDate(fh, 'yyyy-MM-dd', 'en-US') : ''
    };

    this.pesajeCampaniaService.actualizarCampania(this.campania.ID, datos).subscribe({
      next: (res) => {
        this.alertService.success('Actualizado', res.message);

        const updatedCampania = {
          ...this.campania,
          NOMBRE: datos.NombreCampania,
          FECHA_DESDE: datos.FechaDesde ? datos.FechaDesde + 'T00:00:00' : '',
          FECHA_HASTA: datos.FechaHasta ? datos.FechaHasta + 'T00:00:00' : ''
        };

        this.isEditing.set(false);
        this.isUpdating.set(false);

        this.campaniaActualizada.emit(updatedCampania);
      },
      error: (err) => {
        this.alertService.error('Error', `❌ ${err.error?.message}\n${err.error?.error || ''}`);
        this.isUpdating.set(false);
      }
    });
  }
}
