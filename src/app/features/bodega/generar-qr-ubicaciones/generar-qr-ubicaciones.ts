import { Component, inject } from '@angular/core';
import { MatCard, MatCardHeader, MatCardTitle, MatCardContent } from "@angular/material/card";
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { GenerarQrUbicacionesService } from './services/generar-qr-ubicaciones.service';
import { computed, signal, effect } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Alert } from '../../../shared/alert/alert';
import { MatDialog } from '@angular/material/dialog';
import { GetUrlEndpointService } from '../../../core/services/get-url-endpoint.service';
import { MatFormField, MatInputModule, MatLabel } from "@angular/material/input";
import { MatSelect, MatOption } from "@angular/material/select";
import { MatRadioGroup, MatRadioButton } from "@angular/material/radio";
import { MatButtonModule } from "@angular/material/button";
import { NgxPrintModule } from 'ngx-print';
import { FlexLayoutModule } from 'ng-flex-layout';
import { QRCodeComponent } from 'angularx-qrcode';
import { Header } from "../../../shared/header/header";
import { SweetAlertService } from '../../../shared/alert/sweet-alert.service';


@Component({
  selector: 'app-generar-qr-ubicaciones',
  imports: [
    MatCard,
    MatCardContent,
    FormsModule,
    MatFormField,
    MatSelect,
    MatLabel,
    MatOption,
    MatRadioGroup,
    MatRadioButton,
    MatButtonModule,
    ReactiveFormsModule,
    NgxPrintModule,
    FlexLayoutModule,
    QRCodeComponent,
    MatInputModule,
    Header
  ],
  templateUrl: './generar-qr-ubicaciones.html',
  styleUrl: './generar-qr-ubicaciones.scss',
})
export class GenerarQrUbicaciones {

  // ✅ Inyección de dependencias
  private fb = inject(FormBuilder);
  private generarQrUbicacionesService = inject(GenerarQrUbicacionesService);
  private dialog = inject(MatDialog);
  private getUrlEndpointService = inject(GetUrlEndpointService);
  private sweetAlert = inject(SweetAlertService);


  // ✅ Estado reactivo
  qrWidth = signal(255);
  tipoUbicacion = signal<'masiva' | 'manual'>('masiva');
  ubicacionManual = signal<string>('');
  ubicaciones = signal<any[]>([]);

  // ✅ Observable → Signal
  private subniveles = toSignal(
    this.generarQrUbicacionesService.getSubniveles(),
    { initialValue: [] }
  );

  // ✅ Computed derivados
  niveles = computed(() =>
    this.generarQrUbicacionesService.getNivelesByTocken(this.subniveles(), 'NIVEL')
  );

  perchas = computed(() =>
    this.generarQrUbicacionesService.getNivelesByTocken(this.subniveles(), 'PERCHA')
  );

  pallets = computed(() =>
    Array.from({ length: 39 }, (_, i) => ({
      id: i + 1,
      codigo: `S${i + 1}`
    }))
  );

  // ✅ Form moderno (nonNullable)
  form = this.fb.nonNullable.group({
    nivel: [null as any, Validators.required],
    percha: [null as any, Validators.required],
    palletDesde: [null as any, Validators.required],
    palletHasta: [null as any, Validators.required],
  });

  // ✅ Reset limpio
  encerarQRs() {
    this.ubicaciones.set([]);
  }

  generarUbicaciones() {
    this.ubicaciones.set([]);

    //  Modo manual
    if (this.tipoUbicacion() === 'manual') {
      if (!this.ubicacionManual()) {
        this.sweetAlert.warning('Aviso', 'Debe ingresar una ubicación!!');
        return;
      }
      this.ubicaciones.set([
        {
          ubicacion: this.ubicacionManual(),
          urlConsulta: this.getUrlEndpointService.urlConsultaUbicacion + this.ubicacionManual()
        }
      ]);
      return;
    }

    //  Validación form
    if (this.form.invalid) {
      this.sweetAlert.warning('Aviso', 'Debe escoger los parametros para la generacion de las ubicaciones!!');
      return;
    }

    const { nivel, percha, palletDesde, palletHasta } = this.form.getRawValue();

    // control de nulos
    if (!palletDesde || !palletHasta || !nivel || !percha) {
      this.sweetAlert.error('Error', 'Todos los campos son requeridos');
      return;
    }

    // modo masivo
    const nuevasUbicaciones = this.pallets()
      .filter(p => p.id >= palletDesde.id && p.id <= palletHasta.id)
      .map(p => {
        const ubicacion = `${percha.codigo}-${nivel.codigo}-${p.codigo}`;
        return {
          ubicacion,
          urlConsulta: this.getUrlEndpointService.urlConsultaUbicacion + ubicacion
        };
      });

    this.ubicaciones.set(nuevasUbicaciones);
    console.log(this.ubicaciones());
  }

  generarQRManual(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.generarUbicaciones();
    }
  }

}

