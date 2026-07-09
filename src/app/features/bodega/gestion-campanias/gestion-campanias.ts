import { Component, inject, signal } from '@angular/core';
import { Header } from '../../../shared/header/header';
import { MatCard, MatCardContent } from '@angular/material/card';
import { Table, TableColumn } from '../../../shared/table/table';
import { Modal } from '../../../shared/modal/modal';
import { GenerarPesajeCampania } from './components/generar-pesaje-campania/generar-pesaje-campania';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { PesajeCampaniaService } from './services/pesaje-campania.service';
import { CommonModule, DatePipe } from '@angular/common';
import { Campania } from './models/models';
import { ModalService } from '../../../shared/modal/services/modal.service';
import { DetallesCampania } from "./components/detalles-campania/detalles-campania";

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
    DetallesCampania
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

  // signals
  campanias = signal<Campania[]>([]);
  isModalOpen = signal(false);
  isLoading = signal(false);

  // Detalles signal
  isDetallesModalOpen = signal(false);
  campaniaSeleccionada = signal<Campania | null>(null);

  columns: TableColumn[] = [
    { columnDef: 'Id', header: 'Ver', cell: (element: Campania) => `${element.ID}` },
    { columnDef: 'Nombre', header: 'Nombre Campaña', cell: (element: Campania) => `${element.NOMBRE}` },
    { columnDef: 'FechaDesde', header: 'Fecha Desde', cell: (element: Campania) => this.datePipe.transform(element.FECHA_DESDE, 'dd/MM/yyyy') || '' },
    { columnDef: 'FechaHasta', header: 'Fecha Hasta', cell: (element: Campania) => this.datePipe.transform(element.FECHA_HASTA, 'dd/MM/yyyy') || '' },
    { columnDef: 'Estado', header: 'Estado', cell: (element: Campania) => `${element.FINALIZADA ? 'Finalizada' : 'Activa'}` }
  ];
  displayedColumns: string[] = ['Id', 'Nombre', 'FechaDesde', 'FechaHasta', 'Estado'];

  constructor() {
    this.cargarCampanias();
  }

  cargarCampanias() {
    this.isLoading.set(true);
    this.pesajeCampaniaService.listaCampanias().subscribe({
      next: (res: any) => {
        this.campanias.set(res);
        console.log(res);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error al obtener campañas', err);
        this.isLoading.set(false);
      }
    });
  }



  openModal() {
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
    this.cargarCampanias();
  }

  verDetalles(campania: Campania) {
    this.campaniaSeleccionada.set(campania);
    this.isDetallesModalOpen.set(true);
  }

  closeDetallesModal() {
    this.isDetallesModalOpen.set(false);
    this.campaniaSeleccionada.set(null);
  }
}
