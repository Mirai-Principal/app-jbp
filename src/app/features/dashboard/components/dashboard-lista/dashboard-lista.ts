import { Component, inject, Input, signal } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { ModalService } from '../../../../shared/modal/services/modal.service';
import { LoaderPage } from "../../../../shared/loader-page/loader-page";
import { SweetAlertService } from "../../../../shared/alert/services/sweet-alert.service";
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-dashboard-lista',
  imports: [MatIconModule, LoaderPage, CommonModule, MatTableModule, MatButtonModule],
  templateUrl: './dashboard-lista.html',
  styleUrl: './dashboard-lista.scss',
})
export class DashboardLista {
  private modalService = inject(ModalService);
  private dashboardService = inject(DashboardService);
  private sweetAlert = inject(SweetAlertService);
  isLoading = signal(false);
  procesando: boolean = false;
  dash: any = {}
  dashBoards: any[] = [];
  modulosEmpty: any[] = [];
  editing: boolean = false;

  @Input() ModulosAcceso: boolean = false;

  // Sorting properties
  activeSortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor() {
    this.cargarDashboards();
  }

  cargarDashboards() {
    this.isLoading.set(true);
    this.dashboardService.getDasboards().subscribe({
      next: me => {
        if (me.error)
          console.log(me.error);
        else {
          this.dashBoards = me.data;
          console.log(this.dashBoards);
        }
        this.isLoading.set(false);
      }, error: error => {
        console.log(error);
        this.isLoading.set(false);
      }
    });
  }

  sortByColumn(column: string): void {
    // If clicking the same column, toggle direction
    if (this.activeSortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      // If clicking different column, set to ascending
      this.activeSortColumn = column;
      this.sortDirection = 'asc';
    }

    // Apply sorting
    this.dashBoards.sort((a: any, b: any) => {
      let aValue: any;
      let bValue: any;

      // Get values based on column
      switch (this.activeSortColumn) {
        case 'nombre':
          aValue = a.nombre?.toLowerCase() || '';
          bValue = b.nombre?.toLowerCase() || '';
          break;
        case 'modulosStr':
          aValue = a.modulosStr?.toLowerCase() || '';
          bValue = b.modulosStr?.toLowerCase() || '';
          break;
        default:
          return 0;
      }

      // Compare values
      if (aValue < bValue) {
        return this.sortDirection === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return this.sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }


  borrar(dash: any) {
    console.log(dash);
    if (!confirm("Esta seguro de eliminar este dashboard?"))
      return;
    const index = this.dashBoards.findIndex(p => p.id == dash.id);
    this.dashboardService.deleteDasboard(dash.id).subscribe({
      next: me => {
        if (me == 'ok') {
          this.dashBoards.splice(index, 1);
        } else
          this.sweetAlert.error('Error', me);
      }, error: error => {
        console.log(error);
        this.sweetAlert.error('Error', 'Error al eliminar el dashboard');
      }
    });
    this.clearDash();
  }

  editar(dash: any) {
    this.editing = true;
    this.dash = dash;
    // Abrir modal con los datos del dashboard a editar
    this.modalService.openModal(dash);
  }

  clearDash() {
    this.editing = false;
    this.dash = {};
    this.modulosEmpty.forEach(m => m.Checked = false);
    this.dash.modulos = this.modulosEmpty;
    console.log(this.dash);
  }

}

