import { Component, effect, inject, signal } from '@angular/core';
import { Header } from "../../shared/header/header";
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from "@angular/material/card";
import { FormControl, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatProgressSpinner } from "@angular/material/progress-spinner";
import { MatIconModule } from "@angular/material/icon";
import { CommonModule } from "@angular/common";
import { MatTableModule, MatHeaderRowDef, MatRowDef, MatCellDef, MatHeaderCellDef } from "@angular/material/table";
import { Alert } from '../../shared/alert/alert';
import { MatDialog } from '@angular/material/dialog';
import { RetencionesServices } from './services/retenciones.service';
import { map, scan, startWith } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { StatusMsg } from '../../core/models/common.msg';
import { dateUtils } from '../../shared/dateUtils';

@Component({
  selector: 'app-envio-retenciones',
  imports: [
    Header,
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatCardTitle,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatProgressSpinner,
    MatTableModule,
    MatHeaderRowDef,
    MatRowDef,
    MatCellDef,
    MatHeaderCellDef,
    MatIconModule,
    CommonModule],
  templateUrl: './envio-retenciones.html',
  styleUrl: './envio-retenciones.scss',
})
export class EnvioRetenciones {


  // DI
  private retencionesServices = inject(RetencionesServices);
  private dialog = inject(MatDialog);

  // 🔹 estado
  procesando = signal(false);

  // 🔹 form
  mesesControl = new FormControl<string[] | null>(null, Validators.required);

  // 🔹 meses disponibles
  mesesRetencion = signal(dateUtils.getMesesArray());

  // 🔹 columnas
  displayedColumns = ['date', 'msg'];

  // 🔥 stream de estados acumulados
  private status$ = this.retencionesServices.status$.pipe(
    map(status => ({
      ...status,
      msgColor: this.getColor(status.msg)
    })),
    scan((acc, curr) => [curr, ...acc], [] as StatusMsg[]), // 🔥 acumula y ordena
    startWith([])
  );

  // 🔹 signal final para UI
  statusList = toSignal(this.status$, { initialValue: [] });

  constructor() {
    this.setCurrentAndLastMonthByDefault();

    effect(() => {
      this.statusList();
      setTimeout(() => {
        const el = document.querySelector('.log-container');
        el?.scrollTo({ top: el.scrollHeight });
      });
    });
  }

  // 🔹 color del mensaje
  private getColor(msg: string): string {
    const text = msg.toLowerCase();
    return (text.includes('error') || text.includes('no enviada'))
      ? 'red'
      : 'black';
  }

  // 🔹 meses por defecto
  private setCurrentAndLastMonthByDefault() {
    const now = new Date();
    const currentMonth = this.formatMonth(now.getMonth() + 1);

    if (currentMonth === '01') {
      this.mesesControl.setValue([currentMonth]);
    } else {
      const lastMonth = this.formatMonth(now.getMonth());
      this.mesesControl.setValue([lastMonth, currentMonth]);
    }
  }

  private formatMonth(month: number): string {
    return month < 10 ? `0${month}` : `${month}`;
  }

  // 🔥 acción enviar
  enviarRetenciones() {
    if (this.mesesControl.invalid) {
      this.dialog.open(Alert, {
        data: {
          title: 'Error',
          message: 'Debe seleccionar al menos un mes',
          type: 'error'
        }
      });
      this.mesesControl.markAsTouched();
      return;
    }

    this.procesando.set(true);

    this.retencionesServices
      .enviarRetenciones(this.mesesControl.value!.join(','))
      .subscribe({
        next: () => this.procesando.set(false),
        error: () => this.procesando.set(false)
      });
  }
}

