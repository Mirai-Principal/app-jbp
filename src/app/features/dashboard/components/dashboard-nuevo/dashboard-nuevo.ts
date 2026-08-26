import { ChangeDetectorRef, Component, effect, signal, runInInjectionContext, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { DashboardService } from '../../services/dashboard.service';
import { UserService } from '../../../../core/services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { ModalService } from '../../../../shared/modal/services/modal.service';
import { MatSelectModule } from "@angular/material/select";
import { MatFormField, MatLabel, MatInputModule } from "@angular/material/input";
import { FormsModule } from '@angular/forms';
import { MatCardContent, MatCard } from "@angular/material/card";
import { MatIcon } from "@angular/material/icon";
import { MatButtonModule } from '@angular/material/button';
import { ButtonLoader } from "../../../../shared/button-loader/button-loader";
import { SweetAlertService } from "../../../../shared/alert/services/sweet-alert.service";

@Component({
  selector: 'app-dashboard-nuevo',
  imports: [
    ReactiveFormsModule,
    MatSelectModule,
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
  // DI
  private sweetAlert = inject(SweetAlertService);
  private mkService = inject(DashboardService);
  private usrService = inject(UserService);
  private dialog = inject(MatDialog);
  private fb = inject(FormBuilder);
  private cd = inject(ChangeDetectorRef);
  private modalService = inject(ModalService);

  formulario: FormGroup;

  procesando = signal(false);
  dash: any = {}
  dashBoards: any[] = [];
  modulosDisponibles: string[] = [];
  editing: boolean = false;


  constructor(){
    this.dash.modulosSeleccionados = [];
    this.formulario = this.fb.group({
      nombre: ['', [Validators.required]],
      url: ['', [Validators.required]],
      modulos: [[]]
    });

    // Escuchar cuando el modal se cierra
    effect(() => {
      const isOpen = this.modalService.isOpen();
      if (!isOpen) {
        // El usuario solicitó mantener los datos si se cierra accidentalmente
        // this.reiniciarFormulario();
      }
    });

    // Escuchar datos de edición para sincronizar con el formulario
    effect(() => {
      const editData = this.modalService.editData();
      const isOpen = this.modalService.isOpen();
      
      if (isOpen) {
        if (editData) {
          // Si hay datos de edición, cargarlos en el formulario
          this.cargarDatosEdicion(editData);
        } else {
          // Es un modal para un nuevo dashboard
          // Si antes estábamos editando, limpiamos para evitar que se quede el ID y se sobreescriba
          if (this.editing || this.dash.id) {
            this.reiniciarFormulario();
          }
        }
      }
    });
  }

  ngOnInit() {
    this.cargarModulos();
  }


  setModulosTxt() {
    this.dash.modulosStr = '';
    if (this.dash.modulosSeleccionados && this.dash.modulosSeleccionados.length > 0) {
      this.dash.modulosStr = this.dash.modulosSeleccionados.join(', ');
    }
  }

  cargarModulos() {
    this.usrService.getModulos().subscribe({
      next: me => {
        console.log('modulos',me)
        this.modulosDisponibles = me; // Arreglo de strings
        
        // Si estamos en modo edición, pre-seleccionar en base al modulosStr
        if (this.editing && this.dash.modulosStr) {
          this.dash.modulosSeleccionados = this.modulosDisponibles.filter(m => this.dash.modulosStr.includes(m));
        } else {
          this.dash.modulosSeleccionados = [];
        }
        this.cd.detectChanges();
      },
      error: error => {
        console.log(error);

        this.sweetAlert.error('Error', 'Error al cargar los módulos');
      }
    });
  }

  cargarDatosEdicion(editData: any) {
    // Establecer modo edición
    this.editing = true;

    // Copiar datos del dashboard
    this.dash = { ...editData };

    // Si los módulos ya se descargaron, configurarlos
    if (this.modulosDisponibles && this.modulosDisponibles.length > 0) {
      this.dash.modulosSeleccionados = this.modulosDisponibles.filter(m => 
        this.dash.modulosStr ? this.dash.modulosStr.includes(m) : false
      );
    }

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
      this.sweetAlert.warning('Formulario inválido', 'Por favor, complete todos los campos requeridos');
      this.formulario.markAllAsTouched();   // Marcar todos los campos como tocados
      return;
    }

    if (this.dash.modulosStr === '') {
      this.sweetAlert.warning('Formulario inválido', 'Por favor, seleccione al menos un módulo');
      return;
    }

    this.procesando.set(true);

    console.log(this.dash);
    const insertar = (!this.dash.id);
    this.mkService.registrarDashBoard(this.dash).subscribe({
      next: me => {
        console.log(me);
        if (me.error)
          this.sweetAlert.error('Error', me.error);
        else {
          this.mkService.notifyDashboardsChanged();
          this.cargarModulos();
          this.modalService.closeModal();
          this.sweetAlert.success('Éxito', this.editing ? 'Dashboard actualizado exitosamente' : 'Dashboard registrado exitosamente');
        }
        this.clearDash();
        this.procesando.set(false);
      },
      error: error => {
        this.clearDash();
        this.sweetAlert.error('Error', error);
        this.procesando.set(false);
      }
    });
  }
  clearDash() {
    this.editing = false;
    this.dash = {};
    this.dash.modulosSeleccionados = [];
    this.formulario.reset();
  }

  reiniciarFormulario() {
    // Resetear FormGroup completamente
    this.formulario.reset();

    // Limpiar datos del dashboard
    this.dash = {};

    // Resetear estado de edición
    this.editing = false;

    // Resetear módulos
    this.dash.modulosSeleccionados = [];

    // Resetear estado de procesamiento
    this.procesando.set(false);

  }


}
