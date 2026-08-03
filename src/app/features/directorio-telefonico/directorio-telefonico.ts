import { Component, inject, signal } from '@angular/core';
import { DirectorioTelefonicoService } from './services/directorio-telefonico.service';
import { DirectorioMsg } from '../../core/models/directorioMsg';
import { Observable } from 'rxjs';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';
import { ArrayUtils } from '../../shared/arrayUtils';
import { MatCardContent, MatCard } from "@angular/material/card";
import { MatFormField, MatInputModule } from "@angular/material/input";
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Header } from '../../shared/header/header';
import { LoaderPage } from '../../shared/loader-page/loader-page';
import { MatDialog } from '@angular/material/dialog';
import { Alert } from '../../shared/alert/alert';
import { SweetAlertService } from '../../shared/alert/services/sweet-alert.service';

@Component({
  selector: 'app-directorio-telefonico',
  imports: [
    CommonModule,
    Header,
    MatCardContent,
    MatFormField,
    MatInputModule,
    MatCard,
    MatTableModule,
    MatIconModule,
    ReactiveFormsModule,
    LoaderPage,
    MatButtonModule,
  ],
  templateUrl: './directorio-telefonico.html',
  styleUrl: './directorio-telefonico.scss',
})
export class DirectorioTelefonico {

  // DI
  private sweetAlert = inject(SweetAlertService);

  // controles de ingreso en la UI para búsqueda
  txtSearch = new FormControl();
  displayedColumns: string[] = ['CONTACTO', 'Ext', 'DEPARTAMENTO', 'PLANTA'];
  contactos: DirectorioMsg[] = [];
  contactosFiltered!: Observable<DirectorioMsg[]>;

  // Sorting properties
  activeSortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  // Estado de carga
  isLoading = signal(false);


  constructor(private directorioService: DirectorioTelefonicoService, private dialog: MatDialog) {
    this.cargarContactos();
  }

  cargarContactos() {
    this.isLoading.set(true);

    this.directorioService.getDirectorio().subscribe({
      next: (contactos) => {
        //console.log(contactos);
        this.contactos = Array.from(contactos);
        this.mostrarResultadoBusqueda();
      },
      error: (error) => {
        this.isLoading.set(false);
        this.sweetAlert.error('Error', "Error al cargar el directorio")
        console.error('Error al obtener los datos: ', error);
      },
      complete: () => {
        this.isLoading.set(false);
      }
    })
  }
  mostrarResultadoBusqueda() {
    this.contactosFiltered = this.txtSearch.valueChanges.pipe(
      startWith(''),
      map(value => this.filtrarContacto(value))
    );
  }
  filtrarContacto(me: string): DirectorioMsg[] {
    let ms: DirectorioMsg[];
    ms = new Array();
    if (me) {
      me = me.toLocaleLowerCase();
    }
    const matrixToken = me.split(' ');
    for (const item of this.contactos) {
      if (ArrayUtils.contieneTokens(item.CONTACTO + ' ' + item.DEPARTAMENTO + ' ' + item.PLANTA + ' ' + item.Ext, matrixToken)) {
        ms.push(item);
      }
    }
    return ms;
  }

  clearSearch(): void {
    this.txtSearch.setValue('');
  }

  exportToExcel(): void {
    if (!this.contactos || this.contactos.length === 0) {
      this.sweetAlert.warning('Atención', 'No hay datos para exportar');
      return;
    }

    const dataToExport = this.contactos.map(item => ({
      'Contacto': item.CONTACTO,
      'Extensión': item.Ext,
      'Departamento': item.DEPARTAMENTO,
      'Planta': item.PLANTA
    }));

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataToExport);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Directorio');

    XLSX.writeFile(wb, 'Directorio_Telefonico.xlsx');
  }

  exportToPDF(): void {
    if (!this.contactos || this.contactos.length === 0) {
      this.sweetAlert.warning('Atención', 'No hay datos para exportar');
      return;
    }

    const doc = new jsPDF();

    const dataToExport = this.contactos.map(item => [
      item.CONTACTO || '',
      item.Ext?.toString() || '',
      item.DEPARTAMENTO || '',
      item.PLANTA || ''
    ]);

    autoTable(doc, {
      head: [['Contacto', 'Extensión', 'Departamento', 'Planta']],
      body: dataToExport,
      theme: 'grid',
      styles: { fontSize: 9, cellPadding: 2 },
      headStyles: { fillColor: [41, 128, 185], textColor: 255 },
      margin: { top: 20 },
      didDrawPage: (data) => {
        // Título del documento
        doc.setFontSize(16);
        doc.text('Directorio Telefónico', data.settings.margin.left, 15);
      }
    });

    doc.save('Directorio_Telefonico.pdf');
  }

  sortByColumn(column: string): void {
    // If clicking the same column, toggle direction
    if (this.activeSortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      // If clicking different column, set to ascending
      this.activeSortColumn = column;
      this.sortDirection = 'asc';
    }

    // Apply sorting
    this.applySorting();
  }

  private applySorting(): void {
    const sortedData = [...this.contactos].sort((a, b) => {
      let aValue: any;
      let bValue: any;

      // Get values based on column
      switch (this.activeSortColumn) {
        case 'CONTACTO':
          aValue = a.CONTACTO?.toLowerCase() || '';
          bValue = b.CONTACTO?.toLowerCase() || '';
          break;
        case 'Ext':
          aValue = a.Ext?.toString() || '';
          bValue = b.Ext?.toString() || '';
          break;
        case 'DEPARTAMENTO':
          aValue = a.DEPARTAMENTO?.toLowerCase() || '';
          bValue = b.DEPARTAMENTO?.toLowerCase() || '';
          break;
        case 'PLANTA':
          aValue = a.PLANTA?.toLowerCase() || '';
          bValue = b.PLANTA?.toLowerCase() || '';
          break;
        default:
          return 0;
      }

      // Compare values
      if (aValue < bValue) {
        return this.sortDirection === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return this.sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });

    // Update the filtered data
    this.contactosFiltered = new Observable<DirectorioMsg[]>(observer => {
      observer.next(sortedData);
    });
  }

}
