import { Component, input, effect } from '@angular/core';
import { MatTableDataSource, MatCellDef, MatRowDef, MatHeaderCellDef, MatHeaderRowDef, MatColumnDef } from '@angular/material/table';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle, MatCardSubtitle } from "@angular/material/card";
import { MatTable, MatHeaderCell, MatCell, MatHeaderRow, MatRow } from "@angular/material/table";
import { ReporteHoja } from '../models/hoja-ruta.model';
import { CommonModule } from '@angular/common';
import { NgxPrintModule } from 'ngx-print';

@Component({
  selector: 'app-reporte-hoja-ruta',
  imports: [
    MatCard,
    MatCardContent, MatTable,
    MatHeaderCell, MatCell, MatHeaderRow, MatRow,
    MatCellDef, MatRowDef, MatHeaderCellDef,
    MatHeaderRowDef,
    MatColumnDef,
    MatCardHeader,
    MatCardTitle,
    MatCardSubtitle,
    CommonModule,
    NgxPrintModule

  ],
  templateUrl: './reporte-hoja-ruta.html',
  styleUrls: ['./reporte-hoja-ruta.scss'],
})
export class ReporteHojaRuta {
  entregas = input<ReporteHoja[]>([]);
  lugar = input<string>();
  fechaImpresion = new Date();

  displayedColumns: string[] = ['Cliente', 'NumFactura', 'Transporte', 'Ciudad'];
  dataSource = new MatTableDataSource<ReporteHoja>();

  constructor() {
    effect(() => {
      const data = this.entregas() || [];
      this.dataSource.data = data;
    });

  }
}
