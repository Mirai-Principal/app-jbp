import { Component } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
import { UserService } from '../../../../core/services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { Alert } from '../../../../shared/alert/alert';
import { MatCheckbox } from "@angular/material/checkbox";
import { MatFormField } from "@angular/material/input";
import { MatProgressSpinner } from "@angular/material/progress-spinner";
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard-nuevo',
  imports: [MatCheckbox, MatFormField, MatProgressSpinner, FormsModule],
  templateUrl: './dashboard-nuevo.html',
  styleUrl: './dashboard-nuevo.scss',
})
export class DashboardNuevo {
  procesando: boolean = false;
  dash: any = {}
  dashBoards: any[] = [];
  modulosEmpty: any[] = [];
  editing: boolean = false;

  constructor(private userService: UserService, private dashboardService: DashboardService, private dialog: MatDialog) {
    this.dash.modulos = [];
    this.cargarModulos();
  }



  setModulosTxt() {
    this.dash.modulosStr = '';
    var i = 0;
    this.dash.modulos.forEach((modulo: any) => {
      if (modulo.Checked) {
        if (i > 0)
          this.dash.modulosStr += ', ';
        this.dash.modulosStr += modulo.Name;
        i++;
      }

    });
  }
  cargarModulos() {
    this.userService.getModulos().subscribe(me => {
      me.forEach(moduleName => {
        this.modulosEmpty.push({
          Name: moduleName,
          Checked: false
        });
        this.dash.modulos = this.modulosEmpty;
      });
    });
  }

  valido() {
    if (!this.dash.modulosStr) {
      this.dialog.open(Alert, {
        data: {
          title: 'Error',
          message: 'Debe registrar al menos un Modulo!!',
          type: 'error'
        }
      });
      return false;
    }
    if (!this.dash.nombre) {
      this.dialog.open(Alert, {
        data: {
          title: 'Error',
          message: 'Nombre requerido!!',
          type: 'error'
        }
      });
      return false;
    }
    if (!this.dash.url) {
      this.dialog.open(Alert, {
        data: {
          title: 'Error',
          message: 'Url requerido!!',
          type: 'error'
        }
      });
      return false;
    }
    return true;
  }

  registrar() {
    console.log(this.dash);
    this.setModulosTxt();
    if (!this.valido())
      return;
    this.procesando = true;
    console.log(this.dash);
    var insertar = (!this.dash.id);
    this.dashboardService.registrarDashBoard(this.dash).subscribe(me => {
      console.log(me);
      if (me.error)
        this.dialog.open(Alert, {
          data: {
            title: 'Error',
            message: me.error,
            type: 'error'
          }
        });
      else {
        if (insertar)//solo para insertar
          this.dashBoards.push(me);
        console.log(this.dashBoards);

      }
      this.clearDash();
      this.procesando = false;
    }, error => {
      this.clearDash();
      this.dialog.open(Alert, {
        data: {
          title: 'Error',
          message: error,
          type: 'error'
        }
      });
      this.procesando = false;
    });
  }
  clearDash() {
    this.editing = false;
    this.dash = {};
    this.modulosEmpty.forEach(m => m.Checked = false);
    this.dash.modulos = this.modulosEmpty;
    console.log(this.dash);
  }

}
