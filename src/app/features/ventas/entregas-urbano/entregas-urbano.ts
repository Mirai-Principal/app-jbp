import { Component, inject, signal, ViewChild } from '@angular/core';
import { Header } from "../../../shared/header/header";
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators, NgModel } from '@angular/forms';
import { MatFormField, MatInputModule } from '@angular/material/input';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatOption } from "@angular/material/core";
import { MatHeaderCell, MatRow, MatHeaderRow, MatTable, MatCellDef, MatHeaderCellDef, MatHeaderRowDef, MatRowDef } from "@angular/material/table";
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckbox } from "@angular/material/checkbox";
import { MatPaginator } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { EntregaService } from './services/entrega.service';
import { MatTableDataSource } from '@angular/material/table';
import { ElementTabla } from './models/entregas-urbano.models';
import { MatTableModule } from '@angular/material/table';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { ButtonLoader } from "../../../shared/button-loader/button-loader";
import { LoaderPage } from "../../../shared/loader-page/loader-page";
import { SweetAlertService } from '../../../shared/alert/sweet-alert.service';

@Component({
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatInputModule,
    FormsModule,
    MatCardContent,
    MatCard,
    MatButtonModule,
    Header,
    MatSelectModule,
    MatOption,
    MatHeaderCell,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckbox,
    MatRow,
    MatHeaderRow,
    MatPaginator,
    MatTable,
    MatCellDef,
    MatHeaderCellDef,
    MatHeaderRowDef,
    MatRowDef,
    MatTableModule,
    MatIconModule,
    ButtonLoader,
    LoaderPage
  ],
  templateUrl: './entregas-urbano.html',
  styleUrl: './entregas-urbano.scss',
})
export class EntregasUrbano {
  private sweetAlert = inject(SweetAlertService);

  form: FormGroup;
  procesando = signal(false);
  entregas: any[] = [];
  selectAllChecked = signal(false);

  protected readonly bodegas: string[] = ['PT1', 'PT2', 'PICK2'];

  columnsConfig = [
    { key: 'NumFactura', label: 'Codigo Seguimiento/ NUMERO DE FACTURA' },
    { key: 'Fecha', label: 'Fecha' },
    { key: 'Cedula', label: 'Cedula' },
    { key: 'Cliente', label: 'Cliente' },
  ];

  displayedColumns = ['Selected', ...this.columnsConfig.map(c => c.key)];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  dataSource: MatTableDataSource<ElementTabla>;


  constructor(private fb: FormBuilder, private entregaService: EntregaService) {

    this.dataSource = new MatTableDataSource<ElementTabla>([]);

    this.form = this.fb.group({
      fechaDesde: [new Date(), Validators.required],
      fechaHasta: [new Date(), Validators.required],
      bodega: ['', Validators.required],
    });
  }

  getEntregas() {
    if (!this.form.valid)
      return;
    this.procesando.set(true);
    this.entregaService.getEntregasUrbano(this.form.value).subscribe({
      next: (entregas) => {
        this.procesando.set(false);
        this.entregas = entregas;
        this.dataSource.data = entregas;

        // Use setTimeout to ensure paginator is properly initialized
        setTimeout(() => {
          this.dataSource.paginator = this.paginator;
        }, 0);

        // Uncheck todos los items seleccionados
        this.uncheckAll();
      },
      error: (error) => {
        this.procesando.set(false);
        console.error('Error al obtener entregas:', error);
        this.sweetAlert.error('Error', 'Error al obtener entregas');
      }
    });
  }

  selectAll(checked: boolean) {
    this.selectAllChecked.set(checked);
    this.entregas.forEach(entrega => entrega.Selected = checked);
  }

  export(type: 'excel' | 'csv') {
    //filtra solo seleccionados
    const selected = this.entregas.filter(e => e.Selected);

    if (selected.length === 0) {
      this.sweetAlert.warning('Advertencia', 'Debe seleccionar al menos 1 registro a exportar!!');
      return;
    }

    // Transformar data según columnas visibles
    const data = selected.map(row => {
      const newRow: any = {};

      this.columnsConfig.forEach(col => {
        newRow[col.label] = row[col.key];
      });

      return newRow;
    });

    if (type === 'excel') this.exportToExcel(data);
    if (type === 'csv') this.exportToCSV(data);

    // Uncheck todos los items seleccionados
    this.uncheckAll();
  }

  uncheckAll() {
    if (this.entregas) {
      this.entregas.forEach(item => {
        item.Selected = false;
      });

      // Uncheck the 'Select All' checkbox
      this.selectAllChecked.set(false);
    }
  }

  exportToExcel(data: any[]) {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Entregas');

    const buffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array'
    });

    const blob = new Blob([buffer], {
      type: 'application/octet-stream'
    });

    saveAs(blob, 'EntregasUrbano.xlsx');
  }

  exportToCSV(data: any[]) {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const csv = XLSX.utils.sheet_to_csv(worksheet);

    const blob = new Blob(["\uFEFF" + csv], {
      type: 'text/csv;charset=utf-8;'
    });

    saveAs(blob, 'EntregasUrbano.csv');
  }

}
