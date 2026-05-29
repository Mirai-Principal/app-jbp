import { Component, computed, EventEmitter, inject, Output, signal, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCard, MatCardContent } from '@angular/material/card';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  catchError,
  debounceTime, distinctUntilChanged, finalize, startWith, switchMap, tap
} from 'rxjs/operators';
import { of } from 'rxjs';
import { BuscarSocioNegocioService } from './services/buscar-socio-negocio.service';
import { SweetAlertService } from '../alert/services/sweet-alert.service';
import { SocioNegocioItem } from './models/buscar-socio-negocio.model';

@Component({
  selector: 'app-buscar-socio-negocio',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatCard,
    MatCardContent
  ],
  templateUrl: './buscar-socio-negocio.html',
  styleUrl: './buscar-socio-negocio.scss'
})
export class BuscarSocioNegocio {

  // OUTPUTS
  @Output() socioSeleccionado = new EventEmitter<string>();

  // INJECTIONS
  private fb = inject(FormBuilder);
  private snService = inject(BuscarSocioNegocioService);
  private sweetAlert = inject(SweetAlertService);

  // SIGNALS
  procesando = signal(false);
  selectedRuc = signal<string | null>(null);
  mostrarListaCompleta = signal(true);

  listSociosNegocio!: Signal<SocioNegocioItem[]>;
  selectedSocioNegocio = computed(() =>
    this.listSociosNegocio().find(sn => sn.Ruc === this.selectedRuc()) ?? null
  );

  // FORM
  txtSearch = new FormControl<string>('', { nonNullable: true });

  searchForm: FormGroup = this.fb.group({
    txtSearch: this.txtSearch
  });

  // CONSTRUCTOR

  constructor() {
    const busquedaControl = this.searchForm.get('txtSearch')!;

    // Resetear selección cuando cambia el valor de búsqueda
    busquedaControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(() => {
      this.selectedRuc.set(null);
    });

    const busquedaResults$ = busquedaControl.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(value => {
        if (typeof value !== 'string') {
          return of([]);
        }

        const termino = value.trim();
        if (termino.length < 3) {
          return of([]);
        }
        this.procesando.set(true);

        return this.snService.buscarSocioNegocio(termino).pipe(
          tap((resp) => console.log(resp)),
          finalize(() => {
            this.procesando.set(false);
          }),
          catchError((error) => {
            console.error('Error al buscar socios de negocio:', error);
            this.sweetAlert.error('Error', "Ocurrió un error al buscar los socios de negocio");
            return of([]);
          })
        );
      })
    );

    this.listSociosNegocio = toSignal(busquedaResults$, { initialValue: [] });
  }

  // ACCIONES

  onSearchInput(): void {
    this.selectedRuc.set(null);
    this.mostrarListaCompleta.set(true);
  }

  seleccionarSN(ruc: string): void {
    this.selectedRuc.set(ruc);
    this.mostrarListaCompleta.set(false);
    this.txtSearch.setValue('', { emitEvent: false });
    this.socioSeleccionado.emit(ruc);
  }
}
