import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-modal',
  standalone: true,
  templateUrl: './modal.html',
  styleUrls: ['./modal.scss']
})
export class Modal {
  @Input() isOpen = false;
  @Input() title = '';
  @Input() subtitle = '';
  @Input() showCloseButton = true;
  @Input() closeOnBackdropClick = true;
  @Input() loading = false;
  @Input() maxWidth = '800px';
  @Input() maxHeight = '90vh';

  @Output() close = new EventEmitter<void>();
  @Output() backdropClick = new EventEmitter<void>();

  private isMouseDownOnBackdrop = false;

  onClose() {
    this.close.emit();
  }

  onMouseDown(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.isMouseDownOnBackdrop = true;
    } else {
      this.isMouseDownOnBackdrop = false;
    }
  }

  onMouseUp(event: MouseEvent) {
    if (this.isMouseDownOnBackdrop && (event.target as HTMLElement).classList.contains('modal-overlay')) {
      if (this.closeOnBackdropClick) {
        this.backdropClick.emit();
      }
    }
    this.isMouseDownOnBackdrop = false;
  }
}
