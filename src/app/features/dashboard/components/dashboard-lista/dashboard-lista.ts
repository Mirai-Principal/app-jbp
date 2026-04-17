import { Component, signal } from '@angular/core';
import { Alert } from '../../../../shared/alert/alert';
import { DashboardService } from '../../services/dashboard.service';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { LoaderPage } from "../../../../shared/loader-page/loader-page";


@Component({
  selector: 'app-dashboard-lista',
  imports: [MatIconModule, LoaderPage],
  templateUrl: './dashboard-lista.html',
  styleUrl: './dashboard-lista.scss',
})
export class DashboardLista {
  isLoading = signal(false);
  procesando: boolean = false;
  dash: any = {}
  dashBoards: any[] = [];
  modulosEmpty: any[] = [];
  editing: boolean = false;

  constructor(private dashboardService: DashboardService, private dialog: MatDialog) {
    this.cargarDashboards();
  }

  cargarDashboards() {
    this.isLoading.set(true);
    this.dashboardService.getDasboards().subscribe(me => {
      if (me.error)
        console.log(me.error);
      else {
        this.dashBoards = me.data;
        console.log(this.dashBoards);
      }
      this.isLoading.set(false);
    }, error => {
      console.log(error);
      this.isLoading.set(false);
    }
    );
  }


  borrar(dash: any) {
    console.log(dash);
    if (!confirm("Esta seguro de eliminar este dashboard?"))
      return;
    const index = this.dashBoards.findIndex(p => p.id == dash.id);
    this.dashboardService.deleteDasboard(dash.id).subscribe(me => {
      if (me == 'ok') {
        this.dashBoards.splice(index, 1);
      } else
        this.dialog.open(Alert, {
          data: {
            title: 'Error',
            message: me,
            type: 'error'
          }
        });
    }, error => this.dialog.open(Alert, {
      data: {
        title: 'Error',
        message: error,
        type: 'error'
      }
    }));
    this.clearDash();
  }
  editar(dash: any) {
    this.editing = true;
    this.dash = dash;
  }

  clearDash() {
    this.editing = false;
    this.dash = {};
    this.modulosEmpty.forEach(m => m.Checked = false);
    this.dash.modulos = this.modulosEmpty;
    console.log(this.dash);
  }

}
