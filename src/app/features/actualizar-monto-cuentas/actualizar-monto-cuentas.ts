import { Component, inject } from '@angular/core';
import { Header } from "../../shared/header/header";
import { MatCard, MatCardContent, MatCardTitle, MatCardHeader } from "@angular/material/card";
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { ItemMsg } from '../../core/models/common.msg';
import { MatDialog } from '@angular/material/dialog';
import { Alert } from '../../shared/alert/alert';
import { ArrayUtils } from '../../shared/arrayUtils';
import { from, map, Observable, startWith, takeUntil } from 'rxjs';
import { FormBuilder, Validators } from '@angular/forms';
import { CuentasService } from './services/cuentas.service';
import { MatAutocomplete, MatOption, MatAutocompleteTrigger } from "@angular/material/autocomplete";
import { AsyncPipe } from '@angular/common';
import { MatCardModule } from "@angular/material/card";
import { MatAnchor } from "@angular/material/button";

@Component({
  selector: 'app-actualizar-monto-cuentas',
  imports: [
    Header,
    MatCard,
    MatCardContent,
    ReactiveFormsModule,
    MatInputModule,
    MatAutocomplete,
    MatOption,
    MatAutocompleteTrigger,
    AsyncPipe,
    MatCardTitle,
    MatCardModule,
    MatCardHeader,
    MatAnchor
  ],
  templateUrl: './actualizar-monto-cuentas.html',
  styleUrl: './actualizar-monto-cuentas.scss',
})
export class ActualizarMontoCuentas {
  //DI
  private dialog = inject(MatDialog);
  private cuentaServices = inject(CuentasService);
  private formBuilder = inject(FormBuilder);


  form = this.formBuilder.group({
    Periodo: ['', Validators.required],
  });

  periodos: ItemMsg[] = [];
  filteredPeriodo: Observable<ItemMsg[]> = from([]);

  constructor() {
    this.setPeriodos();
    this.cuentaServices.getList().subscribe(item => console.log(item));
  }
  displayPeriodo(me: ItemMsg) {
    return me ? me.Nombre : '';
  }
  setPeriodos() {
    this.cuentaServices.getPeriodos().subscribe({
      next: (me) => {
        if (me.Error !== null) {
          this.dialog.open(Alert, {
            data: {
              title: 'Error',
              message: "Error al obtener los períodos"
            }
          });
          console.log(me);

        } else {
          this.periodos = Array.from(me.List);
          this.filteredPeriodo = this.form.controls.Periodo.valueChanges.pipe(
            startWith(''),
            map(value => this.filtrarPeriodo(value || ''))
          );
        }
      },
      error: (error) => {
        this.dialog.open(Alert, {
          data: {
            title: 'Error',
            message: 'Error al obtener los períodos'
          }
        });
        console.error('Error al obtener los períodos:', error);
      }
    });
  }
  filtrarPeriodo(me: string): ItemMsg[] {
    let ms: ItemMsg[] = [];
    if (typeof me !== 'string') {
      return ms;
    }
    ms = new Array();
    me = me.toLowerCase();
    const matrixToken = me.split(' ');
    for (const item of this.periodos) {
      if (ArrayUtils.contieneTokens(item.Nombre, matrixToken)) {
        ms.push(item);
      }
    }
    return ms;
  }
  procesar() {
    if (this.form.valid) {

      console.log(this.form.value);
    }
  }

}