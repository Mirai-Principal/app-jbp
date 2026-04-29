import { Component, signal, inject } from '@angular/core';
import { FormGroup, Validators, FormBuilder, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatCardActions, MatCard, MatCardContent, MatCardHeader, MatCardTitle } from "@angular/material/card";
import { MatFormField, MatInputModule } from "@angular/material/input";
import { MatIcon } from "@angular/material/icon";
import { Header } from "../../../shared/header/header";
import { MatButtonModule } from '@angular/material/button';

import { FacturaService } from './services/factura.service';
import { ButtonLoader } from "../../../shared/button-loader/button-loader";
import { SweetAlertService } from "../../../shared/alert/sweet-alert.service";

@Component({
  selector: 'app-update-num-factura-exportacion',
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatInputModule,
    FormsModule,
    MatCardContent,
    MatCard,
    MatIcon,
    MatButtonModule,
    MatCardActions,
    Header,
    ButtonLoader,
    MatCardHeader,
    MatCardTitle
  ],
  templateUrl: './update-num-factura-exportacion.html',
  styleUrl: './update-num-factura-exportacion.scss',
})
export class UpdateNumFacturaExportacion {
  form: FormGroup;

  procesando = signal(false);



  private sweetAlert = inject(SweetAlertService);

  constructor(private fb: FormBuilder, private facturaService: FacturaService) {
    this.form = this.fb.group({
      DocNum: ['', [Validators.required]],
      FolioNum: ['', [Validators.required]],
    });
  }

  updateNumFacturaExportacion() {
    if (this.form.invalid) {
      this.sweetAlert.warning('Campos inválidos', 'Por favor, complete todos los campos obligatorios.');
      this.form.markAllAsTouched();
      return;
    }

    // Set processing state
    this.procesando.set(true);

    console.log('Enviando datos:', this.form.value);

    this.form.patchValue({ Actualizador: 'admin' });
    this.facturaService.setNumFacturaExportacion(this.form.value).subscribe({
      next: (resp) => {
        this.procesando.set(false);

        if (resp == 'ok') {
          this.sweetAlert.success('Éxito', 'Se actualizó el número de factura correctamente').subscribe(() => {
            // Reset form after successful update
            this.form.reset();
          });
        } else {
          this.sweetAlert.warning('Advertencia', resp);
        }
      },
      error: (error) => {
        this.procesando.set(false);
        this.sweetAlert.error('Error', error.message || 'Ocurrió un error al procesar la solicitud');
      }
    });

  }
}