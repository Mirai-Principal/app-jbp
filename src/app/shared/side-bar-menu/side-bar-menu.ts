// sidebar.component.ts
import { Component, signal, computed, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarMenuService } from './services/side-bar-menu.service';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { MenuItem } from './models/side-bar-menu.model';
import { UserService } from '../../core/services/user.service';
import { filter } from 'rxjs';
import { enviroment } from '../../assets/enviroment';
import { SidebarStateService } from './services/sidebar-state.service';

@Component({
  selector: 'app-side-bar-menu',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatListModule, RouterModule],
  templateUrl: './side-bar-menu.html',
  styleUrls: ['./side-bar-menu.scss']
})
export class SidebarMenu {
  private router = inject(Router);
  private sidebarState = inject(SidebarStateService);

  // nombre de la empresa
  protected readonly companyName = enviroment.empresaNombre;
  protected readonly usuario = localStorage.getItem('Nombre');

  protected readonly menu = signal<MenuItem[]>([]);
  expandedItems = signal<Set<string>>(new Set());

  // Use shared service signals
  protected readonly collapsed = this.sidebarState.collapsed;
  protected readonly mobileOpen = this.sidebarState.mobileOpen;
  protected readonly isMobile = this.sidebarState.isMobile;

  // ruta actual 
  currentRoute = signal(this.router.url);

  constructor(
    private menuService: SidebarMenuService,
    private userService: UserService
  ) {
    this.menu.set(this.menuService.getMenu());

    // Initialize mobile state
    this.sidebarState.setIsMobile(window.innerWidth < 768);

    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(() => {

        this.currentRoute.set(this.router.url);
        this.expandActiveParents();

        // 🔥 cerrar en mobile SIEMPRE al navegar
        if (this.isMobile()) {
          this.mobileOpen.set(false);
        }

      });
  }

  // 🔥 detectar si un item está activo
  isActive(url?: string): boolean {
    if (!url) return false;
    return this.currentRoute().startsWith(url);
  }

  // 🔥 detectar si algún hijo está activo
  isParentActive(item: MenuItem): boolean {
    return item.children?.some(c => this.isActive(c.url)) ?? false;
  }

  // 🔥 expandir automáticamente el menú activo
  expandActiveParents() {
    const current = new Set<string>();

    this.menu().forEach(item => {
      if (this.isParentActive(item)) {
        current.add(item.name);
      }
    });

    this.expandedItems.set(current);
  }

  handleNavigation() {
    if (this.collapsed()) {
      this.collapsed.set(false);
    }
  }

  toggle(item: MenuItem) {
    const current = new Set(this.expandedItems());

    current.has(item.name)
      ? current.delete(item.name)
      : current.add(item.name);

    this.expandedItems.set(current);
  }

  isExpanded(name: string) {
    return this.expandedItems().has(name);
  }

  toggleSidebar() {
    if (this.isMobile())
      this.toggleMobile()
    else
      this.sidebarState.toggleCollapsed();
  }

  toggleMobile() {
    this.sidebarState.toggleMobileOpen();
  }

  // detectar resize
  @HostListener('window:resize')
  onResize() {
    const wasMobile = this.isMobile();
    const isNowMobile = window.innerWidth < 768;

    this.sidebarState.setIsMobile(isNowMobile);

    // Si entra en modo móvil, resetear el estado colapsado
    if (!wasMobile && isNowMobile) {
      this.sidebarState.setCollapsed(false);
    }
  }

  // sidebar.component.ts

  logout() {
    // si usas signals o estado global
    this.expandedItems.set(new Set());
    // opcional: cerrar menú en mobile
    this.sidebarState.setMobileOpen(false);

    this.userService.logout();
    this.router.navigate(['/login']);
  }
}