import { Component, computed, inject, signal } from '@angular/core';
import { DashboardLista } from './components/dashboard-lista/dashboard-lista';
import { DashboardNuevo } from './components/dashboard-nuevo/dashboard-nuevo';
import { Header } from "../../shared/header/header";
import { Modal } from "../../shared/modal/modal";
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ModalService } from '../../shared/modal/services/modal.service';
import { ButtonLoader } from "../../shared/button-loader/button-loader";
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [DashboardLista, DashboardNuevo, Header, Modal, MatCard, MatCardContent, MatIconModule, ButtonLoader],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
})
export class Dashboard {
  // DI
  private router = inject(Router);

  readonly isOpen: any;
  readonly editData: any;

  private readonly currentUser = localStorage.getItem('currentUser');
  readonly ModulosAcceso = JSON.parse(this.currentUser || '{}')?.ModulosAcceso || {};

  constructor(public modalService: ModalService) {
    this.isOpen = this.modalService.isOpen;
    this.editData = this.modalService.editData;

  }

  //aveces se necesita esto porq no carga a tiempo en el constructor los datos
  /*
  ngOnInit() {
    if (!this.ModulosAcceso.Dashboards) {
      this.router.navigate(['/unauthorized']);
    }
  } */
  ngOnInit() {
  this.checkAccess();
}

checkAccess() {
  if (!this.ModulosAcceso.Dashboards) {
    console.warn('Dashboard: Acceso denegado, redirigiendo a unauthorized...');
    this.router.navigate(['/unauthorized']);
  } else {
    console.log('Dashboard: Acceso concedido, cargando componentes...');
  }
}


  abrirModal() {
    this.modalService.openModal();
  }

}