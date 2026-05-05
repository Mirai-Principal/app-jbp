import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import {
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState
} from '@microsoft/signalr';

import { Observable, Subject, from } from 'rxjs';
import { tap } from 'rxjs/operators';

import { UrlServices, UrlServices2 } from '../../../assets/enviroment';
import { StatusMsg } from '../../../core/models/common.msg';

@Injectable({
  providedIn: 'root'
})
export class RetencionesServices {

  private http = inject(HttpClient);

  private hub!: HubConnection;

  // 🔹 Subjects internos (fuente real)
  private hubConnectedSubject = new Subject<void>();
  private statusSubject = new Subject<StatusMsg>();

  // 🔹 Observables públicos (readonly)
  readonly hubConnected$ = this.hubConnectedSubject.asObservable();
  readonly status$ = this.statusSubject.asObservable();

  constructor() {
    this.initHub();
  }

  // 🔥 Inicialización moderna del Hub
  private initHub() {
    this.hub = new HubConnectionBuilder()
      .withUrl(UrlServices2.retencionesServiceHubUrl)
      .withAutomaticReconnect() // 🔥 reconexión automática
      .build();

    // 🔹 eventos del hub
    this.hub.on('SendMessage', (msg: StatusMsg) => {
      this.statusSubject.next(msg);
    });

    // 🔹 conexión
    from(this.hub.start()).pipe(
      tap(() => {
        console.log('✅ Conectado al Hub');
        this.hubConnectedSubject.next();
        this.requestMsg();
      })
    ).subscribe({
      error: (err) => console.error('❌ Error al conectar al Hub', err)
    });
  }

  // 🔹 request inicial
  private requestMsg() {
    this.http.get(`${UrlServices2.retencionesServiceUrl}/requestMessage`)
      .subscribe({
        error: err => console.error('Error requestMessage', err)
      });
  }

  // 🔥 versión limpia sin new Observable
  enviarRetenciones(mesesRetencion: string): Observable<void> {
    const url = `${UrlServices.autorizacionesSRIServiceUrl}/enviarRetenciones/${mesesRetencion}`;

    return this.http.get<void>(url).pipe(
      tap({
        next: () => console.log('✅ Retenciones enviadas'),
        error: (err) => console.error('❌ Error enviando retenciones', err)
      })
    );
  }

  // 🔹 utilidad opcional
  get isConnected(): boolean {
    return this.hub?.state === HubConnectionState.Connected;
  }
}