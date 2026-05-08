import { Component, HostListener, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-scroll-to-top',
  imports: [CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './scroll-to-top.html',
  styleUrl: './scroll-to-top.scss',
})
export class ScrollToTop {
  visible = signal(false);

  @HostListener('window:scroll')
  onScroll() {
    this.visible.set(window.scrollY > 300);
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
