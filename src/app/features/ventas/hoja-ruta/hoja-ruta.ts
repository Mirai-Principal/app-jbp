import { Component, signal, ViewChild } from '@angular/core';
import { Header } from "../../../shared/header/header";
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators, NgModel } from '@angular/forms';
import { MatFormField, MatInputModule } from '@angular/material/input';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatOption } from "@angular/material/core";
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableDataSource } from '@angular/material/table';
import { ElementTabla } from './models/hoja-ruta.model';
import { MatTableModule } from '@angular/material/table';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { ButtonLoader } from "../../../shared/button-loader/button-loader";
import { LoaderPage } from "../../../shared/loader-page/loader-page";
import { HojaRutaService } from './services/hoja-ruta.service';
import { StringUtils } from '../../../shared/stringUtils';
import { Modal } from "../../../shared/modal/modal";
import { ReporteHojaRuta } from "./reporte-hoja-ruta/reporte-hoja-ruta";
import { ModalService } from '../../../shared/modal/modal.service';
import { Table, TableColumn } from '../../../shared/table/table';



@Component({
  selector: 'app-hoja-ruta',
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
    MatDatepickerModule,
    MatNativeDateModule,
    MatTableModule,
    MatIconModule,
    ButtonLoader,
    LoaderPage,
    Modal,
    ReporteHojaRuta,
    Table
  ],
  templateUrl: './hoja-ruta.html',
  styleUrl: './hoja-ruta.scss',
})
export class HojaRuta {

  protected readonly procesando = signal(false);
  selectAllChecked = signal(false);


  form: FormGroup;
  transportistas: any[] = [];
  entregas: any[] = [];
  data: any[] = [];
  lugares: any[] = ['PIFO', 'PUEMBO'];

  columnsConfig = [
    { key: 'Cliente', label: 'Cliente' },
    { key: 'NumFactura', label: 'Número de Factura' },
    { key: 'Transporte', label: 'Transporte' },
    { key: 'Ciudad', label: 'Ciudad' },
  ];


  displayedColumns = ['Selected', 'Cliente', 'NumFactura', 'Fecha', 'Bodega', 'CantBultos', 'Transporte', 'Ciudad', 'Observaciones', 'NumeroGuia'];

  tableColumns: TableColumn[] = [
    { columnDef: 'Cliente', header: 'Cliente' },
    { columnDef: 'NumFactura', header: 'NumFactura' },
    { columnDef: 'Fecha', header: 'Fecha' },
    { columnDef: 'Bodega', header: 'Bodega' },
    { columnDef: 'CantBultos', header: 'CantBultos' },
    { columnDef: 'Transporte', header: 'Transporte' },
    { columnDef: 'Ciudad', header: 'Ciudad' },
    { columnDef: 'Observaciones', header: 'Observaciones' },
    { columnDef: 'NumeroGuia', header: 'NumeroGuia' }
  ];


  @ViewChild(MatPaginator) paginator!: MatPaginator;
  dataSource: MatTableDataSource<ElementTabla> = new MatTableDataSource<ElementTabla>([]);

  constructor(private hojaRutaService: HojaRutaService, private fb: FormBuilder, public modalService: ModalService) {
    this.form = this.fb.group({
      fechaDesde: [new Date(), Validators.required],
      fechaHasta: [new Date(), Validators.required],
      //nroHojaRuta: [null, Validators.required],
      lugar: ['', Validators.required],
    });
  }

  selectAll(checked: boolean) {
    this.selectAllChecked.set(checked);
    this.entregas.forEach(entrega => entrega.Selected = checked);
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

  getEntregas() {
    if (!this.form.valid)
      return;
    this.procesando.set(true);
    this.hojaRutaService.getHojaRuta(this.form.value).subscribe({
      next: (entregas: any) => {
        if (entregas) {
          this.entregas = entregas;
          this.setUnicKeyEnEntregas()
          this.dataSource.data = entregas;
          // Use setTimeout to ensure paginator is properly initialized
          setTimeout(() => {
            this.dataSource.paginator = this.paginator;
          }, 0);

          // Uncheck todos los items seleccionados
          this.uncheckAll();
          this.procesando.set(false);
        }
      },
      error: (error: any) => {
        this.procesando.set(false);

        console.error('Error al obtener entregas:', error);
        Swal.fire({
          text: 'Error al obtener entregas',
          icon: 'error',
        });
      }
    });
  }
  setUnicKeyEnEntregas() {
    this.entregas.forEach(entrega => {
      entrega.key = StringUtils.getUnicKey();
    });
  }


  generarHojaRuta() {
    //obtener entregas seleccionadas
    var selected = this.entregas.filter(e => e.Selected);
    if (selected.length === 0) {
      Swal.fire({
        text: 'Debe seleccionar al menos 1 registro!!',
        icon: 'warning',
      });
      return;
    }
    //datos a procesar para la hoja de ruta
    this.data = selected.map(row => {
      const newRow: any = {};

      this.columnsConfig.forEach(col => {
        newRow[col.key] = row[col.key];
      });

      return newRow;
    });

    console.log(this.data);

    this.abrirModal();

  }

  // getTransportistByCod(codTransportista: number) {
  //   if (this.transportistas) {
  //     let obj = this.transportistas.find(p => p.Id == codTransportista);
  //     if (obj)
  //       return obj.Nombre;
  //   }
  //   return null;
  // }

  abrirModal() {
    this.modalService.openModal();
  }

}
