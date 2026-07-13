import { Component, inject, OnInit, signal, ViewChild, ElementRef } from '@angular/core';
import { Header } from "../../../../../shared/header/header";
import { MatCard, MatCardContent } from '@angular/material/card';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Table, TableColumn } from '../../../../../shared/table/table';
import { Modal } from '../../../../../shared/modal/modal';
import { CommonModule, formatDate } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { SweetAlertService } from '../../../../../shared/alert/services/sweet-alert.service';
import { ModalService } from '../../../../../shared/modal/services/modal.service';
import { MatProgressSpinner } from "@angular/material/progress-spinner";
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ButtonLoader } from "../../../../../shared/button-loader/button-loader";
import { PesajeCampaniaService } from '../../services/pesaje-campania.service';
import { AgregarOfModal } from '../agregar-of-modal/agregar-of-modal';

@Component({
  selector: 'app-generar-pesaje-campania',
  imports: [
    MatCard,
    MatCardContent,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    Table,
    CommonModule,
    FormsModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ButtonLoader,
    AgregarOfModal
  ],
  templateUrl: './generar-pesaje-campania.html',
  styleUrl: './generar-pesaje-campania.scss',
})
export class GenerarPesajeCampania {
  //DI
  private generarPesajeCampaniaService = inject(PesajeCampaniaService);
  private fb = inject(FormBuilder);
  private alertService = inject(SweetAlertService);
  public modalService = inject(ModalService);

  // signals
  isLoading = signal<boolean>(false);
  isSending = signal<boolean>(false);

  form: FormGroup;

  // Table settings
  ordenesFabricacion = signal<any[]>([]);
  tableColumns: TableColumn[] = [
    { columnDef: 'DocNum', header: 'Num. OF' },
    { columnDef: 'Lote', header: 'Lote' },
    { columnDef: 'Articulo', header: 'Articulo' },
    { columnDef: 'FechaInicio', header: 'Fecha de Inicio' },
    { columnDef: 'FechaFinalizacion', header: 'Fecha de Finalización' },
    { columnDef: 'FechaFabricacion', header: 'Fecha de Fabricación' },
    { columnDef: 'Acciones', header: 'Acciones' }
  ];

  displayedColumns = [...this.tableColumns.map(c => c.columnDef)];

  // Modal settings
  isModalOpen = false;

  constructor() {
    this.form = this.fb.group({
      nombreCampania: [''],
      fechaDesde: [''],
      fechaHasta: ['']
    });
  }

  abrirModal() {
    this.modalService.openModal();
  }

  cerrarModal() {
    this.modalService.closeModal();
  }

  agregarOF(ofDetalle: any) {
    if (ofDetalle) {
      //controlar ingreso repetidos
      const ofExistente = this.ordenesFabricacion().find(o => o.DocNum === ofDetalle.DocNum);
      if (ofExistente) {
        this.alertService.warning('Aviso', '✅ La orden de fabricacion ya existe en la lista');
        return;
      }
      this.ordenesFabricacion.update((items) => [...items, ofDetalle]);
      this.cerrarModal();
    }
  }

  guardarCampania() {
    const fd = this.form.value.fechaDesde;
    const fh = this.form.value.fechaHasta;

    let datos = {
      NombreCampania: this.form.value.nombreCampania,
      FechaDesde: fd ? formatDate(fd, 'yyyy-MM-dd', 'en-US') : '',
      FechaHasta: fh ? formatDate(fh, 'yyyy-MM-dd', 'en-US') : '',
      OrdenesFabricacion: this.ordenesFabricacion()
    }
    console.log(datos);

    this.isSending.set(true);

    this.generarPesajeCampaniaService.crearCampania(datos).subscribe({
      next: (res) => {
        this.alertService.success('Éxito', res.message);
        this.form.reset();
        this.ordenesFabricacion.set([]);
        console.log(res);
        this.isSending.set(false);
      },
      error: (err) => {
        this.alertService.error('Error', `❌ ${err.error.message}\n${err.error.error}`)
        console.error('Error al crear campaña:', err);
        this.isSending.set(false);
      }
    });
  }

  eliminarOF(element: any) {
    this.ordenesFabricacion.update(items => items.filter(item => item.DocNum !== element.DocNum));
  }
}
