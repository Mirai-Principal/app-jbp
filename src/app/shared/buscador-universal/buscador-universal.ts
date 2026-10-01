import {
  Component,
  computed,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  signal,
  SimpleChanges,
  TemplateRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Observable, of, Subject, Subscription } from 'rxjs';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  finalize,
  map,
  switchMap,
  tap,
} from 'rxjs/operators';
import { SweetAlertService } from '../alert/services/sweet-alert.service';
import {
  BuscadorSearchFn,
  KeyOrAccessor,
} from './models/buscador-universal.model';

@Component({
  selector: 'app-buscador-universal',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatCard,
    MatCardContent,
    MatChipsModule,
    MatTooltipModule,
  ],
  templateUrl: './buscador-universal.html',
  styleUrl: './buscador-universal.scss',
})
export class BuscadorUniversal<T = any> implements OnInit, OnChanges, OnDestroy {
  // Inyecciones
  private readonly sweetAlert = inject(SweetAlertService);

  // ==========================================
  // INPUTS DE CONFIGURACIÓN DE BÚSQUEDA
  // ==========================================

  /**
   * Función de búsqueda obligatoria que invoca el service del componente que lo implementa.
   * Ej: (term) => this.service.search(term)
   */
  @Input({ required: true }) searchFn!: BuscadorSearchFn<T>;

  /**
   * Adaptador opcional para mapear la respuesta si viene anidada en un objeto
   */
  @Input() resultAdapter?: (res: any) => T[];

  /**
   * Filtro cliente en memoria opcional posterior a la respuesta
   */
  @Input() filterFn?: (item: T) => boolean;

  // ==========================================
  // INPUTS DE TEXTO Y COMPORTAMIENTO
  // ==========================================

  @Input() label: string = 'Buscar';
  @Input() placeholder: string = 'Escribe al menos 3 caracteres...';
  @Input() icon: string = 'search';
  @Input() minChars: number = 3;
  @Input() debounceTimeMs: number = 300;
  @Input() disabled: boolean = false;
  @Input() autoFocus: boolean = false;

  @Input() resultsTitle: string = 'Resultados';
  @Input() selectedTitle: string = 'Elemento Seleccionado';
  @Input() emptyMessage: string = 'Sin resultados';

  @Input() showSelectedCard: boolean = true;
  @Input() clearOnSelect: boolean = true;
  @Input() showErrorAlert: boolean = true;

  // Claves para mapeo visual de datos
  @Input() primaryKey?: KeyOrAccessor<T, string | number>;
  @Input() titleKey?: KeyOrAccessor<T, string>;
  @Input() subtitleKey?: KeyOrAccessor<T, string>;
  @Input() badgeKey?: KeyOrAccessor<T, string>;

  // Plantillas personalizadas
  @Input() itemTemplate?: TemplateRef<{ $implicit: T; selected: boolean }>;
  @Input() selectedTemplate?: TemplateRef<{ $implicit: T; selected?: boolean }>;

  // Valor inicial seleccionado
  @Input() initialValue: T | null = null;

  // ==========================================
  // OUTPUTS
  // ==========================================

  @Output() readonly itemSeleccionado = new EventEmitter<T>();
  @Output() readonly idSeleccionado = new EventEmitter<string | number>();
  @Output() readonly limpiado = new EventEmitter<void>();
  @Output() readonly procesandoChange = new EventEmitter<boolean>();
  @Output() readonly resultadosChange = new EventEmitter<T[]>();
  @Output() readonly errorBusqueda = new EventEmitter<any>();

  // ==========================================
  // ESTADOS REACTIVOS (SIGNALS)
  // ==========================================

  readonly procesando = signal<boolean>(false);
  readonly resultados = signal<T[]>([]);
  readonly selectedItem = signal<T | null>(null);
  readonly mostrarListaCompleta = signal<boolean>(true);
  readonly busquedaRealizada = signal<boolean>(false);

  // Form Control
  readonly txtSearch = new FormControl<string>('', { nonNullable: true });

  private readonly destroy$ = new Subject<void>();
  private searchSubscription?: Subscription;

  // ID del elemento seleccionado actualmente
  readonly selectedKey = computed(() => {
    const item = this.selectedItem();
    return item ? this.getItemKey(item) : null;
  });

  ngOnInit(): void {
    if (this.initialValue) {
      this.seleccionar(this.initialValue, false);
    }

    if (this.disabled) {
      this.txtSearch.disable();
    }

    this.setupSearchSubscription();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['disabled'] && !changes['disabled'].isFirstChange()) {
      if (this.disabled) {
        this.txtSearch.disable();
      } else {
        this.txtSearch.enable();
      }
    }

    if (changes['initialValue'] && !changes['initialValue'].isFirstChange()) {
      if (this.initialValue) {
        this.seleccionar(this.initialValue, false);
      } else if (this.selectedItem()) {
        this.limpiar(false);
      }
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.searchSubscription?.unsubscribe();
  }

  private setupSearchSubscription(): void {
    this.searchSubscription?.unsubscribe();

    this.searchSubscription = this.txtSearch.valueChanges
      .pipe(
        debounceTime(this.debounceTimeMs),
        distinctUntilChanged(),
        switchMap((value) => {
          if (typeof value !== 'string') {
            return of([]);
          }

          const term = value.trim();

          if (term.length < this.minChars) {
            this.busquedaRealizada.set(false);
            this.resultados.set([]);
            this.resultadosChange.emit([]);
            return of([]);
          }

          this.procesando.set(true);
          this.procesandoChange.emit(true);
          this.busquedaRealizada.set(true);

          return this.ejecutarBusqueda(term).pipe(
            finalize(() => {
              this.procesando.set(false);
              this.procesandoChange.emit(false);
            }),
            catchError((error) => {
              console.error('[BuscadorUniversal] Error en la búsqueda:', error);
              this.errorBusqueda.emit(error);
              if (this.showErrorAlert) {
                this.sweetAlert.error('Error', 'Ocurrió un error al realizar la búsqueda');
              }
              return of([]);
            })
          );
        })
      )
      .subscribe((res) => {
        const items = res || [];
        this.resultados.set(items);
        this.resultadosChange.emit(items);
      });
  }

  private ejecutarBusqueda(term: string): Observable<T[]> {
    if (!this.searchFn) {
      console.warn('[BuscadorUniversal] Falta configurar searchFn.');
      return of([]);
    }

    return this.searchFn(term).pipe(
      map((response: any) => {
        let items: T[] = [];

        if (this.resultAdapter) {
          items = this.resultAdapter(response) || [];
        } else if (Array.isArray(response)) {
          items = response;
        } else if (Array.isArray(response?.data?.value)) {
          items = response.data.value;
        } else if (Array.isArray(response?.data)) {
          items = response.data;
        } else if (Array.isArray(response?.value)) {
          items = response.value;
        } else if (Array.isArray(response?.items)) {
          items = response.items;
        } else if (response) {
          items = [response as T];
        }

        if (this.filterFn) {
          items = items.filter(this.filterFn);
        }

        return items;
      })
    );
  }

  // ==========================================
  // MANIPULACIÓN DE VALORES Y SELECCIÓN
  // ==========================================

  onSearchInput(): void {
    this.mostrarListaCompleta.set(true);
  }

  seleccionar(item: T, emitEvent: boolean = true): void {
    this.selectedItem.set(item);
    this.mostrarListaCompleta.set(false);

    if (this.clearOnSelect) {
      this.txtSearch.setValue('', { emitEvent: false });
    }

    if (emitEvent) {
      const key = this.getItemKey(item);
      this.itemSeleccionado.emit(item);
      this.idSeleccionado.emit(key);
    }
  }

  limpiar(emitEvent: boolean = true): void {
    this.selectedItem.set(null);
    this.resultados.set([]);
    this.busquedaRealizada.set(false);
    this.mostrarListaCompleta.set(true);
    this.txtSearch.setValue('', { emitEvent: false });

    if (emitEvent) {
      this.limpiado.emit();
    }
  }

  reabrirLista(): void {
    this.mostrarListaCompleta.set(true);
  }

  // ==========================================
  // HELPERS DE EXTRACCIÓN DE METADATOS
  // ==========================================

  getItemKey(item: T | null, index?: number): string | number {
    if (!item) return '';

    if (typeof this.primaryKey === 'function') {
      return this.primaryKey(item);
    }
    if (typeof this.primaryKey === 'string' && (item as any)[this.primaryKey] !== undefined) {
      return (item as any)[this.primaryKey];
    }

    if (typeof item === 'object') {
      const anyItem = item as any;
      return anyItem.id ?? anyItem.Id ?? index ?? JSON.stringify(item);
    }

    return String(item);
  }

  getItemTitle(item: T | null): string {
    if (!item) return '';

    if (typeof this.titleKey === 'function') {
      return this.titleKey(item);
    }
    if (typeof this.titleKey === 'string' && (item as any)[this.titleKey] !== undefined) {
      return String((item as any)[this.titleKey]);
    }

    return typeof item === 'string' ? item : '';
  }

  getItemSubtitle(item: T | null): string {
    if (!item) return '';

    if (typeof this.subtitleKey === 'function') {
      return this.subtitleKey(item);
    }
    if (typeof this.subtitleKey === 'string' && (item as any)[this.subtitleKey] !== undefined) {
      return String((item as any)[this.subtitleKey]);
    }

    return '';
  }

  getItemBadge(item: T | null): string {
    if (!item) return '';

    if (typeof this.badgeKey === 'function') {
      return this.badgeKey(item);
    }
    if (typeof this.badgeKey === 'string' && (item as any)[this.badgeKey] !== undefined) {
      return String((item as any)[this.badgeKey]);
    }

    return '';
  }
}
