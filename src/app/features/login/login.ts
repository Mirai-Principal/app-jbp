import { Component, inject, signal } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup, FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UserService } from '../../core/services/user.service';
import { ButtonLoader } from '../../shared/button-loader/button-loader';
import { Router } from '@angular/router';
import { enviroment } from '../../assets/enviroment';
import { SweetAlertService } from '../../shared/alert/services/sweet-alert.service';

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
  // DI
  private sweetAlert = inject(SweetAlertService);

  // Estado de carga
  isLoading = signal(false);
  enviroment = enviroment;

  hide = signal(true);

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router) {

    // validar el formulario
    this.form = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  togglePassword() {
    this.hide.update(v => !v);
  }

  submit() {
    if (this.form.valid) {
      // console.log(this.form.value);
      this.isLoading.set(true);
      const { password, username } = this.form.value;
      this.userService.login({ pwd: password, user: username }).subscribe({
        next: (loginOk) => {
          this.isLoading.set(false);
          if (loginOk) {
            this.router.navigate(['directorio']);
          } else {
            // Mostrar alert personalizado con el error
            this.sweetAlert.warning('Acceso denegado', 'No está autorizado para ingresar');
          }
        },
        error: (error) => {
          console.error('Error en el login:', error);
          this.sweetAlert.error('Error', 'Error al iniciar sesión');
          this.isLoading.set(false);
        }
      });
    }
  }
}