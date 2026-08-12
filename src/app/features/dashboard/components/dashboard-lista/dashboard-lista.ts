import { Component, computed, inject, Input, signal, OnInit } from '@angular/core';
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
export class DashboardLista implements OnInit {
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
  userName = signal<string>("")

  // Sorting properties
  activeSortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor() {
    console.log(localStorage.getItem('currentUser'));
  }

  ngOnInit(): void {
    this.userName.set(JSON.parse(localStorage.getItem('currentUser') || '{}').UserName?.trim());
    this.cargarDashboards();

    this.dashboardService.onDashboardsChanged.subscribe(() => {
      this.cargarDashboards();
    });
  }

  cargarDashboards() {
    this.isLoading.set(true);
    this.dashboardService.getDasboards(this.userName()).subscribe({
      next: me => {
        if (me.error)
          console.log(me.error);
        else {
          this.dashBoards = me.data;
          console.log(this.dashBoards);
          console.log("userName", this.userName());

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
    this.sweetAlert.confirm({
      title: 'Eliminar Dashboard',
      message: 'Esta seguro de eliminar este dashboard?',
      type: 'warning'
    }).subscribe(result => {
      if (result) {
        this.dashboardService.deleteDasboard(dash.id).subscribe({
          next: me => {
            this.sweetAlert.success('Éxito', 'Dashboard eliminado exitosamente');
            this.dashboardService.notifyDashboardsChanged();
          }, error: error => {
            console.log(error);
            this.sweetAlert.error('Error', 'Error al eliminar el dashboard');
          }
        });
        this.clearDash();
      }
    });

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

