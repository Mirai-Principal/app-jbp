import { Component, Input, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { Modal } from '../modal/modal';

@Component({
  selector: 'app-help-modal',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    CommonModule,
    Modal
  ],
  templateUrl: './help-modal.html',
  styleUrl: './help-modal.scss'
})
export class HelpModal {
  isOpen = signal(false);

  @Input() title = '¿Cómo usar?';
  @Input() buttonText = '¿Cómo usar?';
  @Input() icon = 'help_outline';
  @Input() helpContent: string = '';

  openModal() {
    this.isOpen.set(true);
  }

  closeModal() {
    this.isOpen.set(false);
  }
}
