import { Component, inject, signal, computed } from '@angular/core';
import { MatCard, MatCardContent, MatCardTitle } from '@angular/material/card';
import { Header } from '../../../shared/header/header';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SweetAlertService } from '../../../shared/alert/services/sweet-alert.service';
import { NgTemplateOutlet } from '@angular/common';
import { MatIcon } from "@angular/material/icon";
import { MatTable, MatCell, MatHeaderRowDef, MatRowDef, MatCellDef, MatHeaderCell, MatHeaderRow, MatRow, MatColumnDef, MatHeaderCellDef } from "@angular/material/table";
import { ButtonLoader } from "../../../shared/button-loader/button-loader";
import { ParticipantesService } from './services/participantes.service';
import { ModalService } from '../../../shared/modal/services/modal.service';
import { Modal } from "../../../shared/modal/modal";
import { forkJoin } from 'rxjs';
import { LoaderPage } from "../../../shared/loader-page/loader-page";
import { HelpModal } from "../../../shared/help-modal/help-modal";

@Component({
  selector: 'app-gestionar-participantes',
  imports: [Header, MatCard, MatCardContent,
    ReactiveFormsModule, MatHeaderRow, MatRow, ButtonLoader, MatIcon, MatTable, MatHeaderCell, MatCell, MatCellDef,
    MatColumnDef, MatRowDef, MatHeaderRowDef, MatCardTitle, NgTemplateOutlet, FormsModule, MatHeaderCellDef, Modal, LoaderPage, HelpModal],
  templateUrl: './gestionar-participantes.html',
  styleUrl: './gestionar-participantes.scss',
})
export class GestionarParticipantes {
  // DI
  private sweetAlert = inject(SweetAlertService);
  private participantesService = inject(ParticipantesService);
  protected modalService = inject(ModalService);

  //estados
  isLoading = signal(true)
  isSending = signal(false)
  protected participantesSignal = signal<any[]>([]);

  constructor() {
    this.getParticipantes()
  }

  getParticipantes() {
    this.participantesService.getParticipantesPorActualizar().subscribe({
      next: (data) => {
        const initialData = data.map(p => ({ ...p, existeEnPromotick: null }));
        this.participantesSignal.set(initialData);
        this.isLoading.set(false);
        console.log(initialData);

        // Consultar el estado de cada participante
        initialData.forEach((p) => {
          this.participantesService.getEstadoCuentaPromotick(p.RucPrincipal).subscribe({
            next: (estado) => {
              this.participantesSignal.update(current =>
                current.map(item => item.RucPrincipal === p.RucPrincipal ? { ...item, existeEnPromotick: estado.codigo === 1 } : item)
              );
            },
            error: () => {
              this.participantesSignal.update(current =>
                current.map(item => item.RucPrincipal === p.RucPrincipal ? { ...item, existeEnPromotick: false } : item)
              );
            }
          });
        });
      },
      error: (error) => {
        this.sweetAlert.error('Error', 'Ocurrió un problema al obtener los participantes');
        console.error('Error al obtener participantes:', error);
        this.isLoading.set(false);
      }
    });
  }

  protected readonly participantes = computed(() => this.participantesSignal());

  columnsConfig = [
    { columnDef: 'RucPrincipal', header: 'RUC Principal' },
    { columnDef: 'EstadoPromotick', header: 'Estado Promotick' },
    { columnDef: 'nombres', header: 'Nombres' },
    { columnDef: 'apellidos', header: 'Apellidos' },
    { columnDef: 'nombreComercial', header: 'Nombre Comercial' },
    { columnDef: 'email', header: 'Email' },
    { columnDef: 'celular', header: 'Celular' },
  ]
  displayedColumns = this.columnsConfig.map(c => c.columnDef);

  sincronizarParticipante() {
    const data = this.modalService.editData();
    if (!data) return;

    this.sweetAlert.confirm({
      title: 'Sincronizar participante',
      message: 'Se procedera a sincronizar los datos con Promotick del participante ' + data.nombres + ' ' + data.apellidos,
      type: 'warning'
    }).subscribe(result => {
      if (result) {
        this.isSending.set(true);

        //actualizar o registrar participante segun su estado en promotick
        const action$ = data.existeEnPromotick
          ? this.participantesService.actualizarParticipantePorRuc(data.RucPrincipal)
          : this.participantesService.registrarParticipantePorRuc(data.RucPrincipal);

        action$.subscribe({
          next: (resp) => {
            console.log(resp);
            this.sweetAlert.info('Información', 'Proceso completado exitosamente para el participante ' + data.nombres + ' ' + data.apellidos);

            this.participantesSignal.update(current =>
              current.map(p => p.RucPrincipal === data.RucPrincipal ? { ...p, sincronizado: true } : p)
            );

            this.isSending.set(false);
            this.closeModal();
          },
          error: (error: any) => {
            this.sweetAlert.error('Error', error.error.message + '\n' + error.error.error);
            console.error('Error en procesamiento:', error);
            this.isSending.set(false);
          }
        });
      }
    });
  }

  onRucClick(element: any) {
    if (element.sincronizado) return;
    this.modalService.openModal(element); //envia datos al modal
  }

  closeModal() {
    this.modalService.closeModal();
  }
}
