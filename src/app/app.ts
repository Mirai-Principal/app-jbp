import { Component, signal, inject } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavBarMenu } from "./shared/nav-bar-menu/nav-bar-menu";
import { UserService } from './core/services/user.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavBarMenu],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal(' App JBP');
  private readonly router = inject(Router);
  private readonly userService = inject(UserService);

  // Check if user is authenticated
  protected readonly isAuthenticated = signal<boolean>(false);

  constructor() {
    // Check authentication state on init
    this.checkAuthState()
    // Listen to route changes to update auth state
    this.router.events.subscribe(() => {
      this.checkAuthState();
    })

  }

  private checkAuthState(): void {
    const nombre = localStorage.getItem('Nombre');
    this.isAuthenticated.set(!!nombre);
  }

  verificarSiEsAdministrador() {
    let currentUser: any;
    this.userService.currentUser.subscribe({
      next: (usr) => {
        currentUser = usr;
      }
    });

    if (currentUser && currentUser.Perfiles) {
      return currentUser.Perfiles.some((perfil: any) => perfil == "Administrador");
    }
    return false;
  }
}
