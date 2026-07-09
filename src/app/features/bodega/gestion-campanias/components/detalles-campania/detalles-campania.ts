import { Component, Input, inject, OnInit, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Campania, CampaniaDetalles } from '../../models/models';
import { PesajeCampaniaService } from '../../services/pesaje-campania.service';
import { Table, TableColumn } from '../../../../../shared/table/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

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

  detalles = signal<CampaniaDetalles[]>([]);
  isLoading = signal(true);

  columns: TableColumn[] = [
    { columnDef: 'OF', header: 'OF Num', cell: (element: CampaniaDetalles) => `${element.NRO_OF}` },
    { columnDef: 'Lote', header: 'Lote', cell: (element: CampaniaDetalles) => `${element.ID_ST}` }
  ];
  displayedColumns: string[] = ['OF', 'Lote'];

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
        console.log(res);

        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error al obtener detalles', err);
        this.isLoading.set(false);
      }
    });
  }
}
