import { Component, inject, signal, computed } from '@angular/core';
import { MatCard, MatCardContent } from '@angular/material/card';
import { Header } from '../../../shared/header/header';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SweetAlertService } from '../../../shared/alert/services/sweet-alert.service';
import { ActualizarParticipantesService } from './services/actualizar-participantes.service';
import { CommonModule } from '@angular/common';
import { Modal } from "../../../shared/modal/modal";
import { ModalService } from "../../../shared/modal/services/modal.service";
import { MatIcon } from "@angular/material/icon";
import { MatTable, MatCell, MatHeaderRowDef, MatRowDef, MatCellDef, MatHeaderCell, MatHeaderRow, MatRow, MatHeaderCellDef, MatColumnDef } from "@angular/material/table";
import { MatCheckbox } from "@angular/material/checkbox";
import { MatButtonModule } from "@angular/material/button";
import { LoaderPage } from "../../../shared/loader-page/loader-page";
import { ButtonLoader } from "../../../shared/button-loader/button-loader";
import { HelpModal } from "../../../shared/help-modal/help-modal";

@Component({
  selector: 'app-actualizar-participantes',
  imports: [
    Header,
    MatCard,
    MatCardContent,
    ReactiveFormsModule,
    CommonModule,
    Modal,
    MatIcon,
    MatTable,
    MatCell,
    MatHeaderRowDef,
    MatRowDef,
    MatCellDef,
    MatHeaderCell,
    MatCheckbox,
    MatHeaderRow,
    MatRow,
    MatHeaderCellDef,
    MatColumnDef,
    FormsModule,
    MatButtonModule,
    LoaderPage,
    ButtonLoader,
    HelpModal
  ],
  templateUrl: './actualizar-participantes.html',
  styleUrl: './actualizar-participantes.scss',
})
export class ActualizarParticipantes {
  // DI
  private sweetAlert = inject(SweetAlertService);
  private actualizarService = inject(ActualizarParticipantesService);
  protected modalService = inject(ModalService);

  //estados
  isLoading = signal(true)
  protected participantesSignal = signal<any[]>([]);

  constructor() {
    this.getParticipantes()
  }

  getParticipantes() {
    this.actualizarService.getParticipantesPorActualizar().subscribe({
      next: (data) => {
        this.participantesSignal.set(data);
        this.isLoading.set(false);
        console.log(data);
      },
      error: (error) => {
        this.sweetAlert.error('Error', 'Ocurrió un problema al obtener los participantes');
        console.error('Error al obtener participantes:', error);
        this.isLoading.set(false);
      }
    });
  }

  protected readonly participantes = computed(() => this.participantesSignal());

  protected todosRevisados = computed(() => {
    const data = this.participantesSignal();
    if (!data || data.length === 0) return false;
    return data.every((p: any) => p.revisado === true);
  });


  columnsConfig = [
    { columnDef: 'RucPrincipal', header: 'RUC Principal' },
    { columnDef: 'nombres', header: 'Nombres' },
    { columnDef: 'apellidos', header: 'Apellidos' },
    { columnDef: 'nombreComercial', header: 'Nombre Comercial' },
    { columnDef: 'email', header: 'Email' },
    { columnDef: 'celular', header: 'Celular' },
  ]
  displayedColumns = ['Revisado', ...this.columnsConfig.map(c => c.columnDef)];



  onRevisadoChange(element: any, checked: boolean) {
    element.revisado = checked;
    this.participantesSignal.update(current => [...current]);
  }

  marcarComoRevisado() {
    const data = this.modalService.editData();
    if (data) {
      data.revisado = true;
      this.closeModal();
    }
  }

  actualizacionMasivaParticipantes() {
    this.sweetAlert.confirm({
      title: '¿Está seguro?',
      message: 'Esta acción no se puede deshacer',
      type: 'warning'
    }).subscribe(result => {
      if (result) {
        this.actualizarService.actualizacionMasivaParticipantes().subscribe({
          next: (resp) => {
            console.log(resp);
            this.sweetAlert.info('Información', resp);

            this.getParticipantes()
          },
          error: (error) => {
            this.sweetAlert.error('Error', 'Ocurrió un problema al actualizar los participantes');
            console.error('Error en actualización masiva:', error.message);
          }
        })
      }
    });
  }

  onRucClick(element: any) {
    this.modalService.openModal(element);
  }

  closeModal() {
    this.modalService.closeModal();
  }
}
