import { Component, EventEmitter, inject, Output, ViewChild, ElementRef, signal, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Modal } from '../../../../../shared/modal/modal';
import { SweetAlertService } from '../../../../../shared/alert/services/sweet-alert.service';
import { PesajeCampaniaService } from '../../services/pesaje-campania.service';

@Component({
  selector: 'app-agregar-of-modal',
  standalone: true,
  imports: [
    CommonModule, FormsModule, MatInputModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule, Modal
  ],
  templateUrl: './agregar-of-modal.html',
  styleUrl: './agregar-of-modal.scss'
})
export class AgregarOfModal {
  @Input() isOpen = false;
  @Output() closeModal = new EventEmitter<void>();
  @Output() ofAgregada = new EventEmitter<any>();

  // DI
  private alertService = inject(SweetAlertService);
  private generarPesajeCampaniaService = inject(PesajeCampaniaService);


  searchNumOf = '';
  ofDetails = signal<any | null>(null);
  isLoading = signal(false);

  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;

  onOpen() {
    this.searchNumOf = '';
    this.ofDetails.set(null);
    setTimeout(() => {
      this.searchInput?.nativeElement?.focus();
    }, 100);
  }

  buscarOF() {
    if (this.searchNumOf) {
      this.isLoading.set(true);
      this.generarPesajeCampaniaService.buscarOF(Number(this.searchNumOf)).subscribe({
        next: (res) => {
          if (res.length === 0) {
            this.alertService.warning('Aviso', 'No se encontro la orden de fabricacion');
            this.isLoading.set(false);
            this.searchNumOf = '';
            return;
          }

          let ofData = res[0];
          //obtener solo la fecha
          if (ofData && ofData.FechaFabricacion) {
            ofData.FechaFabricacion = ofData.FechaFabricacion.split('T')[0];
            ofData.FechaFinalizacion = ofData.FechaFinalizacion.split('T')[0];
            ofData.FechaInicio = ofData.FechaInicio.split('T')[0];
          }

          this.ofDetails.set(ofData);
          this.isLoading.set(false);
        },
        error: (err) => {
          this.alertService.error('Error', `❌ ${err.error.message}\n${err.error.error}`);
          console.error('Error al buscar OF:', err);
          this.isLoading.set(false);
        }
      });
    }
  }

  onPaste() {
    setTimeout(() => {
      this.buscarOF();
    }, 10);
  }

  agregarOF() {
    if (this.ofDetails()) {
      this.ofAgregada.emit(this.ofDetails());
      this.searchNumOf = '';
      this.ofDetails.set(null);
    }
  }
}
