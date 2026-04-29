import { Component, input, effect } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle, MatCardSubtitle } from "@angular/material/card";
import { ReporteHoja } from '../models/hoja-ruta.model';
import { CommonModule } from '@angular/common';
import { NgxPrintModule } from 'ngx-print';
import { MatButtonModule } from '@angular/material/button';
import { Table, TableColumn } from "../../../../shared/table/table";

@Component({
  selector: 'app-reporte-hoja-ruta',
  imports: [
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatCardTitle,
    MatCardSubtitle,
    CommonModule,
    NgxPrintModule,
    MatButtonModule,
    Table
  ],
  templateUrl: './reporte-hoja-ruta.html',
  styleUrls: ['./reporte-hoja-ruta.scss'],
})
export class ReporteHojaRuta {
  entregas = input<ReporteHoja[]>([]);
  lugar = input<string>();
  fechaImpresion = new Date();

  displayedColumns: string[] = ['Cliente', 'NumFactura', 'Transporte', 'Ciudad'];
  tableColumns: TableColumn[] = [
    { columnDef: 'Cliente', header: 'Cliente' },
    { columnDef: 'NumFactura', header: 'NumFactura' },
    { columnDef: 'Transporte', header: 'Transporte' },
    { columnDef: 'Ciudad', header: 'Ciudad' },
  ];

  dataSource = new MatTableDataSource<ReporteHoja>();

  constructor() {
    effect(() => {
      const data = this.entregas() || [];
      this.dataSource.data = data;
    });

  }
}
