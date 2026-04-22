import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private isOpenSignal = signal(false);
  private editDataSignal = signal<any>(null);

  readonly isOpen = this.isOpenSignal.asReadonly();
  readonly editData = this.editDataSignal.asReadonly();

  openModal(data?: any) {
    this.editDataSignal.set(data || null);
    this.isOpenSignal.set(true);
  }

  closeModal() {
    this.isOpenSignal.set(false);
    this.editDataSignal.set(null);
  }
}
