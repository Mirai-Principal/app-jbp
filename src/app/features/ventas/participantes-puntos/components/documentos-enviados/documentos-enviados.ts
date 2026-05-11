import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatCard, MatCardContent } from '@angular/material/card';
import { Header } from '../../../../../shared/header/header';
import { SweetAlertService } from '../../../../../shared/alert/services/sweet-alert.service';
import { DocumentosEnviadosService } from '../../services/documentos-enviados.service';

@Component({
  selector: 'app-documentos-enviados',
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    // MatCard,
    // MatCardContent,
    // Header,
  ],
  templateUrl: './documentos-enviados.html',
  styleUrl: './documentos-enviados.scss',
})
export class DocumentosEnviados {
  // DI
  private sweetAlert = inject(SweetAlertService);
  docEnviadosservice = inject(DocumentosEnviadosService);

  // estados

  procesando = signal(false);




}
