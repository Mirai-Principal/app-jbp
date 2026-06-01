import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Header } from '../../../../../shared/header/header';
import { MatCard } from '@angular/material/card';
import { MatCardContent } from '@angular/material/card';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { SweetAlertService } from '../../../../../shared/alert/services/sweet-alert.service';
import { DocumentosEnviados } from "../../../components/documentos-enviados/documentos-enviados";
import { DocumentosEnviadosService } from '../../../components/documentos-enviados/services/documentos-enviados.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { LoaderPage } from "../../../../../shared/loader-page/loader-page";

@Component({
  selector: 'app-notas-credito-historial',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    CommonModule,
    Header,
    MatCard,
    MatCardContent,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatSelectModule,
    MatIconModule,
    DocumentosEnviados,
    LoaderPage
  ],
  templateUrl: './notas-credito-historial.html',
  styleUrl: './notas-credito-historial.scss',
})
export class NotasCreditoHistorial {
  // DI
  private sweetAlert = inject(SweetAlertService);
  private documentosEnviadosService = inject(DocumentosEnviadosService);
  private fb = inject(FormBuilder);

  procesando = this.documentosEnviadosService.procesando;

  // FORM
  fechaForm: FormGroup = this.fb.group({
    fecha: [this.today()]
  });

  constructor() {
    // Cargar datos para la fecha por defecto
    this.consultarNotasDeCredito(this.today());

    // Escuchar cambios en la fecha
    this.fechaForm.get('fecha')?.valueChanges.subscribe(fecha => {
      if (fecha) {
        this.consultarNotasDeCredito(fecha);
      }
    });
  }

  // RUCs disponibles para filtrar
  rucs = computed(() => this.documentosEnviadosService.rucsUnicos());
  filtroActivo = computed(() => this.documentosEnviadosService.filtroRuc());

  consultarNotasDeCredito(fecha: Date): void {
    // Formatear fecha a YYYY-MM-DD
    const fechaFormateada = fecha.toISOString().split('T')[0];
    this.documentosEnviadosService.consultarNotasDeCreditoEnviadas(fechaFormateada);
  }

  onFiltroRucChange(ruc: string | null): void {
    this.documentosEnviadosService.filtroRuc.set(ruc);
  }

  today(): Date {
    return new Date();
  }
}
