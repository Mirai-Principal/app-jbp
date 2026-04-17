import { Component } from '@angular/core';
import { DirectorioTelefonicoService } from './services/directorio-telefonico.service';
import { DirectorioMsg } from '../../core/models/directorioMsg';
import { Observable } from 'rxjs';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { map, startWith, debounceTime } from 'rxjs/operators';
import { ArrayUtils } from '../../shared/arrayUtils';
import { MatCardContent, MatCard } from "@angular/material/card";
import { MatFormField, MatInputModule } from "@angular/material/input";
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { Header } from '../../shared/header/header';

@Component({
  selector: 'app-directorio-telefonico',
  imports: [CommonModule, Header, MatCardContent, MatFormField, MatInputModule, MatCard, MatTableModule, MatIconModule, ReactiveFormsModule],
  templateUrl: './directorio-telefonico.html',
  styleUrl: './directorio-telefonico.scss',
})
export class DirectorioTelefonico {
  // controles de ingreso en la UI para búsqueda
  txtSearch = new FormControl();
  displayedColumns: string[] = ['CONTACTO', 'Ext', 'DEPARTAMENTO', 'PLANTA'];
  contactos: DirectorioMsg[] = [];
  contactosFiltered!: Observable<DirectorioMsg[]>;

  // Sorting properties
  activeSortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(private directorioService: DirectorioTelefonicoService) {
    this.cargarContactos();

    // this.contactosFiltered = this.txtSearch.valueChanges.pipe(
    //   startWith(''),
    //   debounceTime(300),
    //   map(value => {
    //     const filterValue = value?.toLowerCase() || '';
    //     return this.contactos.filter(item =>
    //       item.CONTACTO.toLowerCase().includes(filterValue) ||
    //       item.DEPARTAMENTO.toLowerCase().includes(filterValue) ||
    //       item.PLANTA.toLowerCase().includes(filterValue)
    //     );
    //   })
    // );
  }

  cargarContactos() {
    this.directorioService.getDirectorio().subscribe({
      next: (contactos) => {
        //console.log(contactos);
        this.contactos = Array.from(contactos);
        this.mostrarResultadoBusqueda();
      },
      error: (error) => {
        console.error('Error al obtener los datos: ', error);
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
