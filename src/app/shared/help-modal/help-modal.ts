import { CommonModule } from '@angular/common';
import { Component, HostListener, Input, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-help-modal',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    CommonModule
  ],
  templateUrl: './help-modal.html',
  styleUrl: './help-modal.scss'
})
export class HelpModal {
  isOpen = signal(false);

  @Input() title = '¿Cómo usar?';
  @Input() buttonText = '¿Cómo usar?';
  @Input() icon = 'help_outline';
  @Input() helpContent = '';
  @Input() maxWidth = '720px';

  openModal() {
    this.isOpen.set(true);
  }

  closeModal() {
    this.isOpen.set(false);
  }

  @HostListener('document:keydown.escape')
  onEscapeKey() {
    if (this.isOpen()) {
      this.closeModal();
    }
  }
}
