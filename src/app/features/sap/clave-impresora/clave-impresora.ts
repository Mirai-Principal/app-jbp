import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { PageEvent } from '@angular/material/paginator';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { SweetAlertService } from '../../../shared/alert/services/sweet-alert.service';
import { Header } from '../../../shared/header/header';
import { LoaderPage } from '../../../shared/loader-page/loader-page';
import { ModalService } from '../../../shared/modal/services/modal.service';
import { Table, TableColumn } from '../../../shared/table/table';
import { ClaveImpresoraModal } from './components/clave-impresora-modal/clave-impresora-modal';
import { ClaveImpresora as ClaveImpresoraItem, Respuesta } from './clave-impresora.model';
import { MiCuentaServices } from './clave-impresora.service';

@Component({
  selector: 'app-clave-impresora',
  imports: [
    CommonModule,
    FormsModule,
    Header,
    LoaderPage,
    Table,
    ClaveImpresoraModal,
    MatCard,
    MatCardContent,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIcon,
  ],
  templateUrl: './clave-impresora.html',
  styleUrl: './clave-impresora.scss',
})
export class ClaveImpresora implements OnInit {
  private readonly miCuentaService = inject(MiCuentaServices);
  private readonly sweetAlert = inject(SweetAlertService);
  protected readonly modalService = inject(ModalService);
  private readonly destroyRef = inject(DestroyRef);

  private readonly search$ = new Subject<string>();
  private lastSearchedTerm = '';
  private requestSeq = 0;

  protected readonly isLoading = signal<boolean>(false);
  protected readonly registros = signal<ClaveImpresoraItem[]>([]);
  protected readonly total = signal<number>(0);
  protected readonly pageIndex = signal<number>(0);
  protected readonly pageSize = signal<number>(10);
  protected readonly searchTerm = signal<string>('');

  protected readonly columns: TableColumn[] = [
    { columnDef: 'CODIGO', header: 'Código' },
    { columnDef: 'USERNAME', header: 'Usuario' },
    { columnDef: 'TIPO_IMPRESORA', header: 'Tipo de Impresora' },
    { columnDef: 'ACCIONES', header: 'Acciones' },
  ];

  protected readonly displayedColumns: string[] = this.columns.map((c) => c.columnDef);

  ngOnInit(): void {
    this.search$
      .pipe(
        debounceTime(350),
        map((term) => term.trim()),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((term) => {
        if (term === this.lastSearchedTerm) return;
        this.lastSearchedTerm = term;
        this.pageIndex.set(0);
        this.loadRegistros();
      });

    this.loadRegistros();
  }

  onSearchChange(value: string): void {
    this.searchTerm.set(value);
    this.search$.next(value);
  }

  clearSearch(): void {
    this.searchTerm.set('');
    this.lastSearchedTerm = '';
    this.pageIndex.set(0);
    this.search$.next('');
    this.loadRegistros();
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
    this.loadRegistros();
  }

  openInsertModal(): void {
    this.modalService.openModal();
  }

  onClaveGenerada(res: Respuesta): void {
    this.modalService.closeModal();
    const msg =
      res.resp != null
        ? `${res.message}.\n Código asignado: ${res.resp}`
        : res.message || 'Se generó el código para la impresora.';
    this.sweetAlert.success('Clave generada', msg);
    this.pageIndex.set(0);
    this.loadRegistros();
  }

  eliminarRegistro(item: ClaveImpresoraItem): void {
    this.sweetAlert
      .confirm({
        title: '¿Eliminar registro?',
        message: `¿Estás seguro de eliminar la clave (${item.CODIGO}) del usuario "${item.USERNAME}"?`,
        type: 'warning',
        confirmButtonText: 'Eliminar',
        cancelButtonText: 'Cancelar',
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((confirmed) => {
        if (!confirmed) return;

        this.isLoading.set(true);
        this.miCuentaService
          .codigoImpresoraDelete(item.CODIGO)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe({
            next: (res) => {
              this.isLoading.set(false);
              this.sweetAlert.success(
                'Eliminado',
                res?.message || 'Registro eliminado correctamente.'
              );
              if (this.registros().length === 1 && this.pageIndex() > 0) {
                this.pageIndex.update((p) => p - 1);
              }
              this.loadRegistros();
            },
            error: (err: any) => {
              this.isLoading.set(false);
              console.error('Error al eliminar clave de impresora:', err);
              const msg =
                err?.error?.message ||
                err?.error?.error ||
                err?.message ||
                'No se pudo eliminar el registro de impresora.';
              this.sweetAlert.error('Error', msg);
            },
          });
      });
  }

  loadRegistros(): void {
    const seq = ++this.requestSeq;
    this.isLoading.set(true);

    this.miCuentaService
      .getAllCodigoImpresora(this.pageIndex(), this.pageSize(), this.searchTerm())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          if (seq !== this.requestSeq) return;
          const list = Array.isArray(res) ? res : (res?.data ?? []);
          const total = Array.isArray(res) ? res.length : (res?.total ?? list.length);
          this.registros.set(list);
          this.total.set(total);
          this.isLoading.set(false);
        },
        error: (err) => {
          if (seq !== this.requestSeq) return;
          this.isLoading.set(false);
          console.error('Error al cargar códigos de impresora:', err);
          const msg =
            err?.error?.message ||
            err?.error?.error ||
            err?.message ||
            'No se pudieron cargar los registros de impresora.';
          this.sweetAlert.error('Error', msg);
        },
      });
  }
}
