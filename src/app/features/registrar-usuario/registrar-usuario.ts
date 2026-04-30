import { Component, inject, input, signal } from '@angular/core';
import { Header } from "../../shared/header/header";
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from "@angular/material/card";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatFormField } from "@angular/material/input";
import { ParentErrorStateMatcher } from '../../shared/validators/password.validator';
import { UserService } from '../../core/services/user.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ButtonLoader } from "../../shared/button-loader/button-loader";
import { SweetAlertService } from '../../shared/alert/services/sweet-alert.service';

@Component({
  imports: [Header, MatCard,
    MatCardContent,
    MatCardHeader,
    MatCardTitle,
    ReactiveFormsModule,
    MatFormField,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule, ButtonLoader],
  templateUrl: './registrar-usuario.html',
  styleUrl: './registrar-usuario.scss',
})
export class RegistrarUsuario {
  parentErrorStateMatcher = new ParentErrorStateMatcher();

  // DI
  private userService = inject(UserService);
  private formBuilder = inject(FormBuilder);
  private sweetAlert = inject(SweetAlertService);


  protected readonly procesando = signal(false);
  userName = input<string>('');

  form = this.formBuilder.group({
    userName: ['', Validators.required],
  });

  user = signal<any>({});

  createUser() {
    console.log('no implmentado');
  }

  getUser() {
    if (this.form.invalid) {
      return;
    }
    if (this.form.value.userName) {
      this.procesando.set(true);
      this.user.set({})
      this.userService.getUserDetails(this.form.value.userName).subscribe({
        next: (usuario: any) => {
          if (usuario)
            this.user.set({ ...usuario, userName: this.form.value.userName });
          else
            this.sweetAlert.info('Información', 'No se encontro el usuario');
          console.log(usuario);
          this.procesando.set(false);
        },
        error: (error: any) => {
          console.error('Error al obtener el usuario:', error);
          this.sweetAlert.error('Error', 'Ocurrio un error al obtener el usuario');
          this.procesando.set(false);
        }
      });
    }
    else {
      console.error('Debe ingresar el nombre de usuario del Directorio Activo!!');
    }
  }
}
