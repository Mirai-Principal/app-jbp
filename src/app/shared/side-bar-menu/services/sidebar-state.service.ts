import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarStateService {
  // Signal to track if sidebar is collapsed
  readonly collapsed = signal(false);

  // Signal to track if sidebar is mobile open
  readonly mobileOpen = signal(false);

  // Signal to track if it's mobile view
  readonly isMobile = signal(false);

  toggleCollapsed() {
    this.collapsed.update(v => !v);
  }

  setCollapsed(value: boolean) {
    this.collapsed.set(value);
  }

  toggleMobileOpen() {
    this.mobileOpen.update(v => !v);
  }

  setMobileOpen(value: boolean) {
    this.mobileOpen.set(value);
  }

  setIsMobile(value: boolean) {
    this.isMobile.set(value);
  }
}
