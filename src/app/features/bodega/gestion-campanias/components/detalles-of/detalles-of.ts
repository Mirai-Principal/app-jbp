import { Component, Inject, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { Header } from '../../../../../shared/header/header';
import { Table, TableColumn } from '../../../../../shared/table/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PesajeCampaniaService } from '../../services/pesaje-campania.service';
import { ST_ComponentesMsg } from '../../models/models';
import { SweetAlertService } from '../../../../../shared/alert/services/sweet-alert.service';

@Component({
  selector: 'app-detalles-of',
  imports: [
    CommonModule,
    Header,
    MatCard,
    MatCardContent,
    ReactiveFormsModule,
    MatInputModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    Table,
    MatProgressSpinnerModule
  ],
  templateUrl: './detalles-of.html',
  styleUrl: './detalles-of.scss'
})
export class DetallesOf implements OnInit {
  // DI
  private pesajeCampaniaService = inject(PesajeCampaniaService);
  private data = inject(MAT_DIALOG_DATA);

  // Properties mapped from dialog data
  ID_ST: number = this.data.idST;
  NRO_OF: string = this.data.nroOF;

  isLoading = signal(true);
  detallesST = signal<ST_ComponentesMsg[]>([]);
  private alertService = inject(SweetAlertService);


  columns: TableColumn[] = [
    { columnDef: 'Articulo', header: 'Artículo', cell: (element: ST_ComponentesMsg) => `${element.Articulo}` },
    { columnDef: 'Cantidad', header: 'Cantidad', cell: (element: ST_ComponentesMsg) => `${element.Cantidad} ${element.UnidadMedida}` },
    { columnDef: 'Lote', header: 'Lote', cell: (element: ST_ComponentesMsg) => `${element.Lote || 'N/A'}` },
    { columnDef: 'Ubicaciones', header: 'Ubicaciones', cell: (element: ST_ComponentesMsg) => (element.Ubicaciones && element.Ubicaciones.length > 0) ? element.Ubicaciones.map(u => `${u.Ubicacion} (${u.Cantidad} ${element.UnidadMedida})`).join(', ') : 'N/A' },
  ];
  displayedColumns: string[] = ['Articulo', 'Cantidad', 'Lote', 'Ubicaciones'];

  ngOnInit() {
    this.cargarDetallesST();
  }

  cargarDetallesST() {
    this.pesajeCampaniaService.obtenerDetallesST(this.ID_ST).subscribe({
      next: (res) => {
        this.detallesST.set(res);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.alertService.error('Error', `❌ ${err.error.message}\n${err.error.error}`);
        console.error(err);
        this.isLoading.set(false);
      }
    });
  }

}
