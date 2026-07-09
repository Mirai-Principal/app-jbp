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

interface OrdenFabricacionResponse {
  Articulo: string
  DocNum: number
  CodArticulo: string
  FechaCierre: string
  FechaCreacion: string
  FechaFabricacion: string
  FechaFinalizacion: string
  FechaInicio: string
  FechaVencimiento: string
  Id: number
  Lote: string
  Estado: string
}

@Component({
  selector: 'app-generar-pesaje-campania',
  imports: [
    MatCard,
    MatCardContent,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    Table,
    Modal,
    CommonModule,
    FormsModule,
    MatIconModule,
    MatProgressSpinner,
    MatDatepickerModule,
    MatNativeDateModule,
    ButtonLoader
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
  searchNumOf = '';
  ofDetails = signal<OrdenFabricacionResponse | null>(null);

  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;

  constructor() {
    this.form = this.fb.group({
      nombreCampania: [''],
      fechaDesde: [''],
      fechaHasta: ['']
    });
  }

  abrirModal() {
    this.searchNumOf = '';
    this.ofDetails.set(null);
    this.modalService.openModal();
    setTimeout(() => {
      this.searchInput?.nativeElement?.focus();
    }, 100);
  }

  cerrarModal() {
    this.modalService.closeModal();
  }

  buscarOF() {
    if (this.searchNumOf) {
      this.isLoading.set(true);
      this.generarPesajeCampaniaService.buscarOF(Number(this.searchNumOf)).subscribe({
        next: (res) => {
          console.log(res);
          //si no existe mandar alerta y limpiar input
          if (res.length === 0) {
            this.alertService.warning('Aviso', 'No se encontro la orden de fabricacion');
            this.isLoading.set(false);
            this.searchNumOf = '';
            return;
          }

          let ofData = res[0];
          //obtener solo la fecha
          if (ofData && ofData.FechaFabricacion) {
            ofData.FechaFabricacion = ofData.FechaFabricacion.split('T')[0];
            ofData.FechaFinalizacion = ofData.FechaFinalizacion.split('T')[0];
            ofData.FechaInicio = ofData.FechaInicio.split('T')[0];
          }

          this.ofDetails.set(ofData);
          this.isLoading.set(false);
        },
        error: (err) => {
          this.alertService.error('Error', '❌ Error al buscar la orden de fabricacion')
          console.error('Error al buscar OF:', err);
          this.isLoading.set(false);
        }
      });
    }
  }

  onPaste() {
    setTimeout(() => {
      this.buscarOF();
    }, 10);
  }

  agregarOF() {
    if (this.ofDetails()) {
      //controlar ingreso repetidos
      const ofExistente = this.ordenesFabricacion().find(o => o.DocNum === this.ofDetails()?.DocNum);
      if (ofExistente) {
        this.alertService.warning('Aviso', '✅ La orden de fabricacion ya existe en la lista');
        return;
      }
      this.ordenesFabricacion.update((items) => [...items, this.ofDetails()]);
      this.cerrarModal();
    }
  }

  guardarCampania() {
    const fd = this.form.value.fechaDesde;
    const fh = this.form.value.fechaHasta;

    //si algun estado no es cerrado, entonces Finalizada es false
    let Finalizada = true;
    this.ordenesFabricacion().forEach(orden => {
      if (orden.Estado !== 'Cerrado') {
        Finalizada = false;
      }
    });

    let datos = {
      NombreCampania: this.form.value.nombreCampania,
      FechaDesde: fd ? formatDate(fd, 'yyyy-MM-dd', 'en-US') : '',
      FechaHasta: fh ? formatDate(fh, 'yyyy-MM-dd', 'en-US') : '',
      Finalizada,
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
