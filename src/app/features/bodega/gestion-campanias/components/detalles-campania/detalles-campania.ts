import { Component, Input, inject, OnInit, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { Campania, CampaniaDetalles } from '../../models/models';
import { PesajeCampaniaService } from '../../services/pesaje-campania.service';
import { Table, TableColumn } from '../../../../../shared/table/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DetallesOf } from '../detalles-of/detalles-of';

@Component({
  selector: 'app-detalles-campania',
  imports: [
    CommonModule,
    MatCard,
    MatCardContent,
    MatIconModule,
    MatButtonModule,
    Table,
    MatProgressSpinnerModule
  ],
  providers: [DatePipe],
  templateUrl: './detalles-campania.html',
  styleUrl: './detalles-campania.scss',
})
export class DetallesCampania implements OnInit {
  @Input() campania!: Campania;

  private pesajeCampaniaService = inject(PesajeCampaniaService);
  private dialog = inject(MatDialog);

  detalles = signal<CampaniaDetalles[]>([]);
  isLoading = signal(true);

  columns: TableColumn[] = [
    { columnDef: 'Id', header: 'Ver' },
    { columnDef: 'OF', header: 'OF Num', cell: (element: CampaniaDetalles) => `${element.NRO_OF}` },
    { columnDef: 'Lote', header: 'Lote', cell: (element: CampaniaDetalles) => `${element.ID_ST}` }
  ];
  displayedColumns: string[] = ['Id', 'OF', 'Lote'];

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
      },
      error: (err) => {
        console.error('Error al obtener detalles', err);
        this.isLoading.set(false);
      }
    });
  }

  abrirDetallesST(idST: number, nroOF: string) {
    this.dialog.open(DetallesOf, {
      width: '900px',
      maxWidth: '95vw',
      data: { idST, nroOF }
    });
  }
}
