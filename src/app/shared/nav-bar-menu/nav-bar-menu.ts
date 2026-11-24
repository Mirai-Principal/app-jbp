// sidebar.component.ts
import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, ViewChild, computed, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarMenuService } from './services/nav-bar-menu.service';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { MenuItem } from './models/nav-bar-menu.model';
import { UserService } from '../../core/services/user.service';
import { filter } from 'rxjs';
import { enviroment } from '../../assets/enviroment';
import { NavBarStateService } from './services/nav-bar-state.service';
import { entorno } from '../../assets/conf';

@Component({
  selector: 'app-nav-bar-menu',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatListModule, RouterModule],
  templateUrl: './nav-bar-menu.html',
  styleUrls: ['./nav-bar-menu.scss']
})
export class NavBarMenu implements AfterViewInit, OnDestroy {
  private router = inject(Router);
  private navbarState = inject(NavBarStateService);
  private elementRef = inject(ElementRef<HTMLElement>);

  @ViewChild('topbarContainer') private topbarContainer?: ElementRef<HTMLElement>;
  @ViewChild('brandEl') private brandEl?: ElementRef<HTMLElement>;
  @ViewChild('navEl') private navEl?: ElementRef<HTMLElement>;
  @ViewChild('navUserEl') private navUserEl?: ElementRef<HTMLElement>;
  @ViewChild('navItemsEl') private navItemsEl?: ElementRef<HTMLElement>;
  @ViewChild('navFooterEl') private navFooterEl?: ElementRef<HTMLElement>;
  @ViewChild('measureWrapperEl') private measureWrapperEl?: ElementRef<HTMLElement>;

  private resizeObserver?: ResizeObserver;
  private recalcRafId: number | null = null;
  private isViewReady = false;

  // nombre de la empresa
  protected readonly companyName = enviroment.empresaNombre;
  protected get usuario(): string {
    return localStorage.getItem('Nombre') || '';
  }
  protected readonly entorno = entorno;           //? pa saber si estamos en modo desarrollo o no

  private menuService = inject(NavbarMenuService);
  private userService = inject(UserService);

  protected readonly menu = this.menuService.menu;
  protected readonly visibleMenuItems = computed(() =>
    this.menu().filter(item => this.isVisible(item))
  );
  private readonly maxVisibleItems = signal<number>(Number.MAX_SAFE_INTEGER);

  protected readonly primaryItems = computed(() => {
    const items = this.visibleMenuItems();
    if (this.isMobile()) return items;
    return items.slice(0, this.maxVisibleItems());
  });

  protected readonly overflowItems = computed(() => {
    const items = this.visibleMenuItems();
    if (this.isMobile()) return [];
    return items.slice(this.maxVisibleItems());
  });

  protected readonly isOverflowActive = computed(() =>
    this.overflowItems().some(item => this.isActive(item.url) || this.isParentActive(item))
  );

  expandedItems = signal<Set<string>>(new Set());
  nestedLeftItems = signal<Set<string>>(new Set());
  rightAlignedItems = signal<Set<string>>(new Set());

  // Use shared service signals
  protected readonly collapsed = this.navbarState.collapsed;
  protected readonly mobileOpen = this.navbarState.mobileOpen;
  protected readonly isMobile = this.navbarState.isMobile;

  private readonly mobileBreakpoint = 1024;

  // ruta actual 
  currentRoute = signal(this.router.url);

  constructor() {
    // Initialize mobile state
    this.navbarState.setIsMobile(window.innerWidth <= this.mobileBreakpoint);

    effect(() => {
      this.visibleMenuItems();
      this.isMobile();
      if (this.isViewReady) {
        this.scheduleRecalculate();
      }
    });

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

  ngAfterViewInit(): void {
    this.isViewReady = true;

    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(() => this.scheduleRecalculate());
      const targets = [
        this.topbarContainer?.nativeElement,
        this.brandEl?.nativeElement,
        this.navUserEl?.nativeElement,
        this.navFooterEl?.nativeElement
      ];
      targets.forEach(el => {
        if (el) this.resizeObserver?.observe(el);
      });
    }

    if (typeof document !== 'undefined' && 'fonts' in document) {
      document.fonts.ready.then(() => this.scheduleRecalculate());
    }

    this.scheduleRecalculate();
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
    if (this.recalcRafId !== null) {
      cancelAnimationFrame(this.recalcRafId);
      this.recalcRafId = null;
    }
  }

  private scheduleRecalculate(): void {
    if (this.recalcRafId !== null) {
      cancelAnimationFrame(this.recalcRafId);
    }
    this.recalcRafId = requestAnimationFrame(() => {
      this.recalcRafId = null;
      this.recalculateOverflow();
    });
  }

  private recalculateOverflow(): void {
    const visibleItems = this.visibleMenuItems();

    if (this.isMobile() || visibleItems.length === 0) {
      if (this.maxVisibleItems() !== Number.MAX_SAFE_INTEGER) {
        this.maxVisibleItems.set(Number.MAX_SAFE_INTEGER);
      }
      return;
    }

    const containerEl = this.topbarContainer?.nativeElement;
    const brandEl = this.brandEl?.nativeElement;
    const navEl = this.navEl?.nativeElement;
    const navUserEl = this.navUserEl?.nativeElement;
    const navItemsEl = this.navItemsEl?.nativeElement;
    const navFooterEl = this.navFooterEl?.nativeElement;
    const measureWrapperEl = this.measureWrapperEl?.nativeElement;

    if (!containerEl || !brandEl || !navEl || !navItemsEl || !navFooterEl || !measureWrapperEl) {
      return;
    }

    const measureNodes = Array.from(
      measureWrapperEl.querySelectorAll<HTMLElement>('[data-measure-item]')
    );

    if (measureNodes.length !== visibleItems.length) {
      return;
    }

    const containerStyle = getComputedStyle(containerEl);
    const navStyle = getComputedStyle(navEl);
    const navItemsStyle = getComputedStyle(navItemsEl);

    const paddingX = (parseFloat(containerStyle.paddingLeft) || 0) + (parseFloat(containerStyle.paddingRight) || 0);
    const topbarGap = parseFloat(containerStyle.columnGap || containerStyle.gap) || 16;
    const navGap = parseFloat(navStyle.columnGap || navStyle.gap) || 12;
    const itemGap = parseFloat(navItemsStyle.columnGap || navItemsStyle.gap) || 6;

    const containerInnerWidth = containerEl.clientWidth - paddingX;
    const brandWidth = brandEl.getBoundingClientRect().width;
    const userWidth = navUserEl ? navUserEl.getBoundingClientRect().width : 0;
    const footerWidth = navFooterEl.getBoundingClientRect().width;
    const topbarGapsCount = 2;
    const navGapsCount = userWidth > 0 ? 1 : 0;
    const safetyMargin = 10;

    const availableForItems =
      containerInnerWidth -
      brandWidth -
      topbarGapsCount * topbarGap -
      userWidth -
      footerWidth -
      navGapsCount * navGap -
      safetyMargin;

    const itemWidths = measureNodes.map(el => el.getBoundingClientRect().width);
    const totalWidth = itemWidths.reduce(
      (sum, width, idx) => sum + width + (idx > 0 ? itemGap : 0),
      0
    );

    let nextVisibleCount = itemWidths.length;

    if (totalWidth > availableForItems) {
      const moreMeasureEl = measureWrapperEl.querySelector<HTMLElement>('[data-measure-more]');
      const moreWidth = moreMeasureEl ? moreMeasureEl.getBoundingClientRect().width : 84;
      const budget = availableForItems - moreWidth;

      let used = 0;
      let fitCount = 0;
      for (let i = 0; i < itemWidths.length; i++) {
        const nextUsed = used + itemWidths[i] + itemGap;
        if (nextUsed <= budget) {
          used = nextUsed;
          fitCount++;
        } else {
          break;
        }
      }

      nextVisibleCount = Math.max(0, Math.min(fitCount, itemWidths.length - 1));
    }

    if (this.maxVisibleItems() !== nextVisibleCount) {
      this.maxVisibleItems.set(nextVisibleCount);
      this.rightAlignedItems.set(new Set());
    }
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

  // 🔥 comprobar si un elemento debe ser visible
  isVisible(item: MenuItem): boolean {
    return 'visible' in item ? Boolean(item.visible) : true;
  }

  // 🔥 detectar si algún hijo está activo (recursivo para múltiples niveles)
  isParentActive(item: MenuItem): boolean {
    if (!item.children) return false;
    return item.children.some(c => {
      if (!this.isVisible(c)) return false;
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
          if (!this.isVisible(child)) return;
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
      if (this.isVisible(item) && this.isParentActive(item)) {
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
        if (ancestors.length === 0) {
          this.updateDropdownAlignment(this.getDropdownKey(item), event?.currentTarget as HTMLElement | null);
        } else {
          this.updateNestedDirection(item.name, event?.currentTarget as HTMLElement | null);
        }
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

  getDropdownKey(item: MenuItem): string {
    return item.name || item.icon || '';
  }

  alignsRight(key: string): boolean {
    return this.rightAlignedItems().has(key);
  }

  onDropdownHover(key: string, event: MouseEvent) {
    if (this.isMobile()) return;
    this.updateDropdownAlignment(key, event.currentTarget as HTMLElement | null);
  }

  private updateDropdownAlignment(key: string, triggerElement: HTMLElement | null) {
    if (!triggerElement || this.isMobile()) return;

    const host = triggerElement.classList.contains('nav-dropdown')
      ? triggerElement
      : triggerElement.closest('.nav-dropdown');

    if (!host) return;

    const dropdown = host.querySelector(':scope > .dropdown-menu') as HTMLElement | null;
    if (!dropdown) return;

    const hostRect = host.getBoundingClientRect();
    const menuWidth = dropdown.offsetWidth || 240;
    const shouldAlignRight = hostRect.left + menuWidth + 8 > window.innerWidth;
    const current = new Set(this.rightAlignedItems());

    if (shouldAlignRight) {
      current.add(key);
    } else {
      current.delete(key);
    }

    this.rightAlignedItems.set(current);
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
    const isNowMobile = window.innerWidth <= this.mobileBreakpoint;

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
    this.rightAlignedItems.set(new Set());
    this.scheduleRecalculate();
  }

  // sidebar.component.ts

  logout() {
    // si usas signals o estado global
    this.expandedItems.set(new Set());
    this.nestedLeftItems.set(new Set());
    this.rightAlignedItems.set(new Set());
    // opcional: cerrar menú en mobile
    this.navbarState.setMobileOpen(false);

    this.userService.logout();
    this.router.navigate(['/login']);
  }
}
