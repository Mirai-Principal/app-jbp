// sidebar.component.ts
import { Component, signal, computed, HostListener, inject, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarMenuService } from './services/nav-bar-menu.service';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { MenuItem } from './models/nav-bar-menu.model';
import { UserService } from '../../core/services/user.service';
import { filter } from 'rxjs';
import { enviroment } from '../../assets/enviroment';
import { NavBarStateService } from './services/nav-bar-state.service';

@Component({
  selector: 'app-nav-bar-menu',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatListModule, RouterModule],
  templateUrl: './nav-bar-menu.html',
  styleUrls: ['./nav-bar-menu.scss']
})
export class NavBarMenu {
  private router = inject(Router);
  private navbarState = inject(NavBarStateService);
  private elementRef = inject(ElementRef<HTMLElement>);

  // nombre de la empresa
  protected readonly companyName = enviroment.empresaNombre;
  protected readonly usuario = localStorage.getItem('Nombre');

  protected readonly menu = signal<MenuItem[]>([]);
  expandedItems = signal<Set<string>>(new Set());
  nestedLeftItems = signal<Set<string>>(new Set());

  // Use shared service signals
  protected readonly collapsed = this.navbarState.collapsed;
  protected readonly mobileOpen = this.navbarState.mobileOpen;
  protected readonly isMobile = this.navbarState.isMobile;

  // ruta actual 
  currentRoute = signal(this.router.url);

  constructor(
    private menuService: SidebarMenuService,
    private userService: UserService
  ) {
    this.menu.set(this.menuService.getMenu());

    // Initialize mobile state
    this.navbarState.setIsMobile(window.innerWidth < 992);

    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(() => {

        this.currentRoute.set(this.router.url);
        this.expandedItems.set(new Set());

        // 🔥 cerrar en mobile SIEMPRE al navegar
        if (this.isMobile()) {
          this.mobileOpen.set(false);
        }

      });
  }

  onNavLinkClick() {
    this.expandedItems.set(new Set());
    if (this.isMobile()) {
      this.navbarState.setMobileOpen(false);
    }
  }

  // 🔥 detectar si un item está activo
  isActive(url?: string): boolean {
    if (!url) return false;
    return this.currentRoute().startsWith(url);
  }

  // 🔥 detectar si algún hijo está activo (recursivo para múltiples niveles)
  isParentActive(item: MenuItem): boolean {
    if (!item.children) return false;
    return item.children.some(c => {
      if (this.isActive(c.url)) return true;
      if (c.children) return this.isParentActive(c);
      return false;
    });
  }

  // 🔥 expandir automáticamente el menú activo (recursivo para múltiples niveles)
  expandActiveParents() {
    const current = new Set<string>();

    const addActiveParents = (item: MenuItem) => {
      if (item.children) {
        item.children.forEach(child => {
          if (this.isActive(child.url) || (child.children && this.isParentActive(child))) {
            current.add(item.name);
            if (child.children) {
              current.add(child.name);
            }
          }
        });
      }
    };

    this.menu().forEach(item => {
      if (this.isParentActive(item)) {
        current.add(item.name);
        addActiveParents(item);
      }
    });

    this.expandedItems.set(current);
  }

  handleNavigation() {
    if (this.collapsed()) {
      this.collapsed.set(false);
    }
  }

  toggle(item: MenuItem, ancestors: string[] = [], event?: MouseEvent) {
    event?.stopPropagation();

    if (!this.isMobile()) {
      if (item.children) {
        this.updateNestedDirection(item.name, event?.currentTarget as HTMLElement | null);
      }
      return;
    }

    if (item.children) {
      this.updateNestedDirection(item.name, event?.currentTarget as HTMLElement | null);
    }

    const current = new Set(this.expandedItems());

    if (current.has(item.name)) {
      current.delete(item.name);
      this.expandedItems.set(current);
      return;
    }

    this.expandedItems.set(new Set([...ancestors, item.name]));
  }

  isExpanded(name: string) {
    return this.expandedItems().has(name);
  }

  opensToLeft(name: string) {
    return this.nestedLeftItems().has(name);
  }

  onNestedHover(name: string, event: MouseEvent) {
    if (this.isMobile()) return;
    this.updateNestedDirection(name, event.currentTarget as HTMLElement | null);
  }

  private updateNestedDirection(name: string, triggerElement: HTMLElement | null) {
    if (!triggerElement || this.isMobile()) return;

    const host = triggerElement.classList.contains('nav-dropdown')
      ? triggerElement
      : triggerElement.closest('.nav-dropdown');

    if (!host) return;

    const dropdown = host.querySelector('.dropdown-menu.nested-menu') as HTMLElement | null;
    if (!dropdown) return;

    const hostRect = host.getBoundingClientRect();
    const menuWidth = dropdown.offsetWidth || 220;
    const opensLeft = hostRect.right + menuWidth + 8 > window.innerWidth;
    const current = new Set(this.nestedLeftItems());

    if (opensLeft) {
      current.add(name);
    } else {
      current.delete(name);
    }

    this.nestedLeftItems.set(current);
  }

  toggleSidebar() {
    if (this.isMobile())
      this.toggleMobile()
    else
      this.navbarState.toggleCollapsed();
  }

  toggleMobile() {
    this.navbarState.toggleMobileOpen();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as Node | null;
    if (!target) return;

    const clickedInside = this.elementRef.nativeElement.contains(target);
    if (!clickedInside) {
      this.expandedItems.set(new Set());
      this.nestedLeftItems.set(new Set());
      if (this.isMobile() && this.mobileOpen()) {
        this.navbarState.setMobileOpen(false);
      }
    }
  }

  // detectar resize
  @HostListener('window:resize')
  onResize() {
    const wasMobile = this.isMobile();
    const isNowMobile = window.innerWidth < 992;

    this.navbarState.setIsMobile(isNowMobile);

    // Si entra en modo móvil, resetear el estado colapsado
    if (!wasMobile && isNowMobile) {
      this.navbarState.setCollapsed(false);
    }

    // Si sale de modo móvil, cerrar el menú móvil
    if (wasMobile && !isNowMobile) {
      this.navbarState.setMobileOpen(false);
    }

    if (wasMobile !== isNowMobile) {
      this.nestedLeftItems.set(new Set());
    }
  }

  // sidebar.component.ts

  logout() {
    // si usas signals o estado global
    this.expandedItems.set(new Set());
    this.nestedLeftItems.set(new Set());
    // opcional: cerrar menú en mobile
    this.navbarState.setMobileOpen(false);

    this.userService.logout();
    this.router.navigate(['/login']);
  }
}
