import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Header } from '../../../shared/header/header';
import { MatCard } from '@angular/material/card';
import { MatCardContent } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { filter, switchMap, tap } from 'rxjs/operators';
import { SweetAlertService } from '../../../shared/alert/services/sweet-alert.service';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../../core/services/user.service';
import { SocioNegocioService } from './services/socio-negocio.service';
import { DocumentosEnviadosService } from '../components/documentos-enviados/services/documentos-enviados.service';
import { EstadoCuentaPromotick } from './components/estado-cuenta-promotick/estado-cuenta-promotick';
import { ItemMsg } from '../../../core/models/common.msg';
import { ScrollToTop } from "../../../shared/scroll-to-top/scroll-to-top";
import { DocumentosEnviados } from "../components/documentos-enviados/documentos-enviados";
import { LoaderPage } from "../../../shared/loader-page/loader-page";
import { BuscarSocioNegocio } from "../../../shared/buscar-socio-negocio/buscar-socio-negocio";

@Component({
  selector: 'app-participantes-puntos',
  imports: [
    CommonModule,
    Header,
    MatCard,
    MatCardContent,
    MatTabsModule,
    EstadoCuentaPromotick,
    ScrollToTop,
    DocumentosEnviados,
    LoaderPage,
    BuscarSocioNegocio
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

  seSeleccionoSocioNegocio = signal(false);
  seEncontraroSN = signal(false);
  elite = signal(false);
  selectedTab = signal(0);
  obteniendoEstadoCuenta = signal(false);

  participante = signal<any | null>(null);

  vendedores = signal<ItemMsg[]>([]);

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
  // CONSTRUCTOR
  // =========================

  constructor() {
    this.loadVendedores();
    this.listenQueryParams();
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

  seleccionarSN(ruc: string): void {
    this.snService.selectSocioNegocio(ruc);
    this.snService.getParticipanteByRuc(ruc).subscribe(participante => {
      this.setParticipante(participante);
      this.selectedTab.set(0);
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

    this.documentosEnviadosService.consultarDocumentosEnviados(participante.RucPrincipal);
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
  // MANEJAR ESTADO DE PROCESAMIENTO DEL HIJO
  // =========================

  onProcesandoChange(estado: boolean): void {
    this.obteniendoEstadoCuenta.set(estado);
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
