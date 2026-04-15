import { Component, signal } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup, FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LoginData } from './models/login.model';
import { UserService } from '../../core/services/user.service';
import { ButtonLoader } from '../../shared/button-loader/button-loader';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Alert } from '../../shared/alert/alert';
import { enviroment } from '../../assets/enviroment';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    FormsModule,
    ButtonLoader,

  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})

export class Login {
  // Estado de carga
  isLoading = signal(false);
  enviroment = enviroment;

  hide = signal(true);

  form: FormGroup<LoginData>;

  constructor(private fb: FormBuilder, private userService: UserService, private router: Router, private dialog: MatDialog) {

    // validar el formulario
    this.form = this.fb.group<LoginData>({
      username: this.fb.control('', [Validators.required]),
      password: this.fb.control('', [Validators.required])
    });
  }

  togglePassword() {
    this.hide.update(v => !v);
  }

  submit() {
    if (this.form.valid) {
      // console.log(this.form.value);
      this.isLoading.set(true);
      this.userService.login(this.form.value).subscribe({
        next: (loginOk) => {
          this.isLoading.set(false);
          if (loginOk) {
            this.router.navigate(['directorio']);
          } else {
            // Mostrar alert personalizado con el error
            this.dialog.open(Alert, {
              data: {
                title: 'Acceso denegado',
                message: "No está autorizado para ingresar",
                type: 'warning'
              }
            });
          }
        },
        error: (error) => {
          console.error('Error en el login:', error);
          this.dialog.open(Alert, {
            data: {
              title: 'Error al iniciar sesión',
              message: "Error al iniciar sesión",
              type: 'error'
            }
          });
          this.isLoading.set(false);
        }
      });
    }
  }
}