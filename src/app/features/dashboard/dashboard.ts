import { Component, computed, signal } from '@angular/core';
import { DashboardLista } from './components/dashboard-lista/dashboard-lista';
import { DashboardNuevo } from './components/dashboard-nuevo/dashboard-nuevo';
import { Header } from "../../shared/header/header";
import { Modal } from "../../shared/modal/modal";
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ModalService } from '../../shared/modal/services/modal.service';
import { ButtonLoader } from "../../shared/button-loader/button-loader";

@Component({
  selector: 'app-dashboard',
  imports: [DashboardLista, DashboardNuevo, Header, Modal, MatCard, MatCardContent, MatIconModule, ButtonLoader],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
})
export class Dashboard {
  readonly isOpen: any;
  readonly editData: any;

  private readonly currentUser = localStorage.getItem('currentUser');
  readonly ModulosAcceso = JSON.parse(this.currentUser || '{}')?.ModulosAcceso || {};

  constructor(public modalService: ModalService) {
    this.isOpen = this.modalService.isOpen;
    this.editData = this.modalService.editData;
  }

  abrirModal() {
    this.modalService.openModal();
  }

}