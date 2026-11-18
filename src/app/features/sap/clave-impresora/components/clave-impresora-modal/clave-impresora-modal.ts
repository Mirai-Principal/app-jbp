import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnChanges, Output, signal, SimpleChanges } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { finalize } from 'rxjs/operators';
import { SweetAlertService } from '../../../../../shared/alert/services/sweet-alert.service';
import { Modal } from '../../../../../shared/modal/modal';
import { Respuesta } from '../../clave-impresora.model';
import { MiCuentaServices } from '../../clave-impresora.service';

@Component({
  selector: 'app-clave-impresora-modal',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    Modal,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './clave-impresora-modal.html',
  styleUrl: './clave-impresora-modal.scss',
})
export class ClaveImpresoraModal implements OnChanges {
  @Input() isOpen = false;
  @Output() closeModal = new EventEmitter<void>();
  @Output() saved = new EventEmitter<Respuesta>();

  private readonly fb = inject(FormBuilder);
  private readonly miCuentaService = inject(MiCuentaServices);
  private readonly sweetAlert = inject(SweetAlertService);

  protected readonly isSaving = signal<boolean>(false);

  protected readonly tiposImpresora: { value: string; label: string }[] = [
    { value: 'Color', label: 'Color' },
    { value: 'Blanco y Negro', label: 'Blanco y Negro' },
  ];

  protected readonly form = this.fb.group({
    username: ['', [Validators.required, Validators.maxLength(100)]],
    impresora: ['', [Validators.required]],
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isOpen']?.currentValue === true) {
      this.form.reset({ username: '', impresora: '' });
    }
  }

  onSave(): void {
    if (this.form.invalid || this.isSaving()) {
      this.form.markAllAsTouched();
      return;
    }

    const username = (this.form.value.username ?? '').trim();
    const impresora = this.form.value.impresora ?? '';

    if (!username) {
      this.form.get('username')?.setErrors({ required: true });
      this.form.markAllAsTouched();
      return;
    }

    this.isSaving.set(true);
    this.miCuentaService
      .codigoImpresoraInsert(username, impresora)
      .pipe(finalize(() => this.isSaving.set(false)))
      .subscribe({
        next: (res) => {
          this.saved.emit(res);
        },
        error: (err: any) => {
          console.error('Error al generar clave de impresora:', err);
          const msg =
            err?.error?.message ||
            err?.error?.error ||
            err?.message ||
            'No se pudo generar la clave de impresora.';

          if (err?.status === 409 || err?.status === 400) {
            this.sweetAlert.warning('Aviso', msg);
            return;
          }

          this.sweetAlert.error('Error', msg);
        },
      });
  }

  onCancel(): void {
    if (this.isSaving()) return;
    this.closeModal.emit();
  }
}
