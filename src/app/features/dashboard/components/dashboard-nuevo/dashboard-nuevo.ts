import { ChangeDetectorRef, Component, effect, signal, runInInjectionContext } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { DashboardService } from '../../services/dashboard.service';
import { UserService } from '../../../../core/services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { ModalService } from '../../../../shared/modal/modal.service';
import { MatCheckbox } from "@angular/material/checkbox";
import { MatFormField, MatLabel, MatInputModule } from "@angular/material/input";
import { FormsModule } from '@angular/forms';
import { MatCardContent, MatCard } from "@angular/material/card";
import { MatIcon } from "@angular/material/icon";
import { MatButtonModule } from '@angular/material/button';
import { ButtonLoader } from "../../../../shared/button-loader/button-loader";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dashboard-nuevo',
  imports: [
    ReactiveFormsModule,
    MatCheckbox,
    MatFormField,
    MatInputModule,
    FormsModule,
    MatLabel,
    MatCardContent,
    MatCard,
    MatIcon,
    MatButtonModule,
    ButtonLoader
  ],
  templateUrl: './dashboard-nuevo.html',
  styleUrl: './dashboard-nuevo.scss',
})
export class DashboardNuevo {
  formulario: FormGroup;

  procesando = signal(false);
  dash: any = {}
  dashBoards: any[] = [];
  modulosEmpty: any[] = [];
  editing: boolean = false;

  constructor(public mkService: DashboardService,
    private usrService: UserService,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private cd: ChangeDetectorRef,
    private modalService: ModalService) {
    this.dash.modulos = [];
    this.formulario = this.fb.group({
      nombre: ['', [Validators.required]],
      url: ['', [Validators.required]],
      modulos: [[]]
    });

    // Escuchar cuando el modal se cierra para reiniciar formulario
    effect(() => {
      const isOpen = this.modalService.isOpen();
      if (!isOpen) {
        // Cuando el modal se cierra, reiniciar todo
        this.reiniciarFormulario();
      }
    });

    // Escuchar datos de edición para sincronizar con el formulario
    effect(() => {
      const editData = this.modalService.editData();
      if (editData) {
        // Si hay datos de edición, cargarlos en el formulario
        this.cargarDatosEdicion(editData);
      }
    });
  }

  ngOnInit() {
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
    this.usrService.getModulos().subscribe({
      next: me => {
        this.modulosEmpty = me.map(moduleName => ({
          Name: moduleName,
          Checked: false
        }));
        this.dash.modulos = [...this.modulosEmpty]; // nueva referencia
        this.cd.detectChanges();
      },
      error: error => {
        console.log(error);

        Swal.fire({
          title: 'Error',
          text: 'Error al cargar los módulos',
          icon: 'error'
        });
      }
    });
  }

  cargarDatosEdicion(editData: any) {
    // Establecer modo edición
    this.editing = true;

    // Copiar datos del dashboard
    this.dash = { ...editData };

    // Sincronizar formulario con los datos
    this.formulario.patchValue({
      nombre: editData.nombre || '',
      url: editData.url || ''
    });

    // Marcar formulario como tocado para mostrar validaciones
    this.formulario.markAllAsTouched();

    console.log('Datos de edición cargados:', editData);
  }

  editar(dash: any) {
    this.editing = true;
    this.dash = dash;
  }
  registrar() {
    this.dash.nombre = this.formulario.get('nombre')?.value;
    this.dash.url = this.formulario.get('url')?.value;

    this.setModulosTxt();

    if (!this.formulario.valid) {
      Swal.fire({
        title: 'Formulario inválido',
        text: 'Por favor, complete todos los campos requeridos',
        icon: 'warning'
      });
      this.formulario.markAllAsTouched();   // Marcar todos los campos como tocados
      return;
    }

    if (this.dash.modulosStr === '') {
      Swal.fire({
        title: 'Formulario inválido',
        text: 'Por favor, seleccione al menos un módulo',
        icon: 'warning'
      });
      return;
    }

    this.procesando.set(true);

    console.log(this.dash);
    const insertar = (!this.dash.id);
    this.mkService.registrarDashBoard(this.dash).subscribe({
      next: me => {
        console.log(me);
        if (me.error)
          Swal.fire({
            title: 'Error',
            text: me.error,
            icon: 'error'
          });
        else {
          if (insertar)//solo para insertar
            this.dashBoards.push(me);
          console.log(this.dashBoards);
          this.cargarModulos();

          // Cerrar modal cuando se registra exitosamente
          this.modalService.closeModal();

          Swal.fire({
            icon: "success",
            text: "Dashboard registrado exitosamente",
            showConfirmButton: false,
            timer: 1500
          });

        }
        this.clearDash();
        this.procesando.set(false);
      },
      error: error => {
        this.clearDash();
        Swal.fire({
          title: 'Error',
          text: error,
          icon: 'error'
        });
        this.procesando.set(false);
      }
    });
  }
  clearDash() {
    this.editing = false;
    this.dash = {};
    this.modulosEmpty.forEach(m => m.Checked = false);
    this.dash.modulos = this.modulosEmpty;
    this.formulario.reset();
  }

  reiniciarFormulario() {
    // Resetear FormGroup completamente
    this.formulario.reset();

    // Limpiar datos del dashboard
    this.dash = {};

    // Resetear estado de edición
    this.editing = false;

    // Resetear módulos si ya están cargados
    if (this.modulosEmpty.length > 0) {
      this.modulosEmpty.forEach(m => m.Checked = false);
      this.dash.modulos = [...this.modulosEmpty];
    }

    // Resetear estado de procesamiento
    this.procesando.set(false);

  }


}
