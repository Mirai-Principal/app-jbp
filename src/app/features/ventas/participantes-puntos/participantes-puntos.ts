import { Component, computed, effect, inject, Signal, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Header } from '../../../shared/header/header';
import { MatCard } from '@angular/material/card';
import { MatCardContent } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinner } from "@angular/material/progress-spinner";
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  catchError,
  debounceTime, distinctUntilChanged, filter, finalize, map, startWith, switchMap, tap
} from 'rxjs/operators';
import { SweetAlertService } from '../../../shared/alert/services/sweet-alert.service';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../../core/services/user.service';
import { SocioNegocioService } from './services/socio-negocio.service';
import { DocumentosEnviadosService } from './services/documentos-enviados.service';
import { EstadoCuentaPromotick } from './components/estado-cuenta-promotick/estado-cuenta-promotick';
import { ArrayUtils } from '../../../shared/arrayUtils';
import { ItemMsg } from '../../../core/models/common.msg';
import { SocioNegocioItem } from '../../../core/models/socioNegocioMsg';
import { of } from 'rxjs';
import { ScrollToTop } from "../../../shared/scroll-to-top/scroll-to-top";
import { DocumentosEnviados } from "./components/documentos-enviados/documentos-enviados";

@Component({
  selector: 'app-participantes-puntos',
  imports: [
    CommonModule,
    Header,
    MatCard,
    MatCardContent,
    ReactiveFormsModule,
    MatInputModule,
    MatProgressSpinner,
    MatTabsModule,
    MatIconModule,
    MatButtonModule,
    EstadoCuentaPromotick,
    ScrollToTop,
    DocumentosEnviados
  ],
  templateUrl: './participantes-puntos.html',
  styleUrl: './participantes-puntos.scss'
})
export class ParticipantesPuntos {

  // =========================
  // INJECTIONS
  // =========================

  private fb = inject(FormBuilder);
  private snService = inject(SocioNegocioService);
  private documentosEnviadosService = inject(DocumentosEnviadosService);
  private userService = inject(UserService);
  private route = inject(ActivatedRoute);
  private sweetAlert = inject(SweetAlertService);


  // =========================
  // SIGNALS
  // =========================

  procesando = signal(false);
  seSeleccionoSocioNegocio = signal(false);
  seEncontraroSN = signal(false);
  elite = signal(false);
  selectedTab = signal(0);
  selectedRuc = signal<string | null>(null);

  participante = signal<any | null>(null);

  listSociosNegocio!: Signal<SocioNegocioItem[]>;
  vendedores = signal<ItemMsg[]>([]);

  // =========================
  // FORM
  // =========================

  txtSearch = new FormControl<string>('', { nonNullable: true });

  searchForm: FormGroup = this.fb.group({
    txtSearch: this.txtSearch
  });

  form: FormGroup = this.fb.group({
    nombres: [null, Validators.required],
    apellidos: [null],
    email: [null, Validators.email],
    tipoDocumento: [null, Validators.required],
    nroDocumento: [null, Validators.required],
    NroDocumentoAnterior: [null],
    RucPrincipal: [null, Validators.required],
    clave: [null, Validators.required],
    Activo: [false, Validators.required],
    FechaNacimiento: [null, Validators.required],
    celular: [null],
    telefono: [null],
    tipoGenero: [null, [Validators.required, Validators.min(1)]],
    idCatalogo: [null, Validators.required],
    Elite: [false, Validators.required],
    vendedor: [null, Validators.required],
    metaAnual: [null, Validators.required],
    Comentario: [null],
  });

  // =========================
  // CATALOGOS
  // =========================

  readonly generos: ItemMsg[] = [
    { Id: 1, Cod: '', Nombre: 'Masculino' },
    { Id: 2, Cod: '', Nombre: 'Femenino' }
  ];

  readonly categorias: ItemMsg[] = [
    { Id: 1, Cod: '', Nombre: 'A' },
    { Id: 2, Cod: '', Nombre: 'B' }
  ];

  readonly tiposDocumento: ItemMsg[] = [
    { Id: 1, Cod: '', Nombre: 'Cédula' },
    { Id: 2, Cod: '', Nombre: 'Ruc' }
  ];

  // =========================
  // SEARCH SIGNAL
  // =========================

  readonly searchValue = toSignal(
    this.txtSearch.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged()
    ),
    { initialValue: '' }
  );

  // =========================
  // CONSTRUCTOR
  // =========================

  constructor() {
    this.loadVendedores();
    this.listenQueryParams();

    // Configurar búsqueda
    const busquedaControl = this.searchForm.get('txtSearch')!;

    // Resetear tab cuando cambia el valor de búsqueda
    busquedaControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(() => {
      this.selectedTab.set(0);
      this.seSeleccionoSocioNegocio.set(false);
    });

    const busquedaResults$ = busquedaControl.valueChanges.pipe(
      startWith(''),
      debounceTime(300),  //? tiempo de espera antes de enviar la solicitud
      distinctUntilChanged(),  //? evitar solicitudes duplicadas
      switchMap(value => {
        // Si es un objeto Cliente, no buscar
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
            return of([]); // Devolver array vacío en caso de error
          })
        );
      })
    );

    this.listSociosNegocio = toSignal(busquedaResults$, { initialValue: [] });
  }

  // =========================
  // LOADERS
  // =========================

  private loadVendedores(): void {
    this.snService.getVendedores().subscribe(items => {
      this.vendedores.set(items);
    });
  }

  // =========================
  // QUERY PARAMS
  // =========================

  private listenQueryParams(): void {
    this.route.queryParams.pipe(
      filter(params => !!params?.['rucCliente'] && !!params?.['idVendedor']),
      switchMap(params =>
        this.snService.getParticipanteByRuc(params['rucCliente']).pipe(
          tap(participante => {
            this.setParticipante(
              participante,
              params['idVendedor']
            );
          })
        )
      )
    ).subscribe();
  }



  // =========================
  // SELECCIONAR SN
  // =========================

  onSearchInput(): void {
    this.selectedTab.set(0);
    this.seSeleccionoSocioNegocio.set(false);
  }

  seleccionarSN(ruc: string): void {
    this.selectedRuc.set(ruc);
    this.snService.selectSocioNegocio(ruc);
    this.snService.getParticipanteByRuc(ruc).subscribe(participante => {
      this.setParticipante(participante);
      this.selectedTab.set(1);
    });
  }

  // =========================
  // PARTICIPANTE
  // =========================

  private setParticipante(
    participante: any,
    idVendedor: number | null = null
  ): void {

    if (!participante?.nombres) {
      this.sweetAlert.info('Información', 'El ruc no esta asociado a ningún participante del plan puntos!!');
      this.form.reset();
      this.seSeleccionoSocioNegocio.set(false);
      return;
    }

    this.form.reset();

    if (!this.usuarioAutorizado(participante, idVendedor)) {
      return;
    }

    this.participante.set(participante);

    this.seSeleccionoSocioNegocio.set(true);

    this.form.patchValue(participante);

    this.documentosEnviadosService
      .consultarDocumentosEnviados(participante.RucPrincipal);
  }

  // =========================
  // AUTORIZACION
  // =========================

  usuarioAutorizado(
    participante: any,
    idVendedor: number | null = null
  ): boolean {

    if (
      this.loggedUserHasPerfil('tics') ||
      this.loggedUserPerteneceAlGrupo('Promotick')
    ) {
      return true;
    }

    if (this.loggedUserHasPerfil('Ventas')) {

      const correoUsuario =
        this.userService.currentUserValue?.correo?.toLowerCase();

      const correoVendedor =
        participante?.correoVendedor?.toLowerCase();

      if (correoUsuario === correoVendedor) {
        return true;
      }
    }

    if (
      idVendedor &&
      participante?.idVendedor === idVendedor
    ) {
      return true;
    }

    this.sweetAlert.info('Información', 'Ud no está autorizado para ver este participante!!');
    return false;
  }

  loggedUserHasPerfil(perfil: string): boolean {

    const grupos =
      this.userService.currentUserValue?.GruposDirectorioActivo;

    return grupos?.includes(perfil) ?? false;
  }

  loggedUserPerteneceAlGrupo(grupo: string): boolean {

    const grupos =
      this.userService.currentUserValue?.GruposDirectorioActivo;

    return grupos?.includes(grupo) ?? false;
  }

  // =========================
  // GUARDAR
  // =========================

  guardar(): void {

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.sweetAlert.warning('Advertencia', 'Existen campos por validar!!');
      return;
    }

    this.snService.Save(this.form.getRawValue()).subscribe((resp: any) => {
      if (resp.Error) {
        this.sweetAlert.error('Error', 'No se pudo guardar la Información del participante \n  Error: ' + resp.Error);
        return;
      }

      this.sweetAlert.success('Éxito', 'Info del participante guardada con éxito');
    });
  }

}
