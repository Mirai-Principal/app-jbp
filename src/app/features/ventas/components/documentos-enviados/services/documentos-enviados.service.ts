import { computed, inject, Injectable, signal } from '@angular/core';
import { DocumentoEnviadoMsg } from '../../../../../core/models/documentoEnviadoMsg';
import { Observable } from 'rxjs';
import { GetUrlEndpointService } from '../../../../../core/services/get-url-endpoint.service';
import { HttpClient } from '@angular/common/http';
import { documentosEnviadosResponse, response } from '../models/documentos-enviados.model';
import { SweetAlertService } from '../../../../../shared/alert/services/sweet-alert.service';

@Injectable({
  providedIn: 'root',
})
export class DocumentosEnviadosService {
  private getUrlEndpointService = inject(GetUrlEndpointService);
  private http = inject(HttpClient);
  private sweetAlert = inject(SweetAlertService);


  private readonly _documentosEnviados = signal<DocumentoEnviadoMsg[]>([]);

  // Filtro por RUC
  readonly filtroRuc = signal<string | null>(null);

  // RUCs únicos extraídos de los datos
  readonly rucsUnicos = computed(() => {
    const rucs = this._documentosEnviados().map(d => (d as any).ruc);
    return [...new Set(rucs)].filter(Boolean).sort();
  });

  readonly documentosEnviados = computed(() => {
    const filtro = this.filtroRuc();
    const docs = this._documentosEnviados();
    if (!filtro) return docs;
    return docs.filter(d => (d as any).ruc === filtro);
  });
  procesando = signal(false);

  consultarDocumentosEnviados(ruc: string) {
    this.procesando.set(true);
    this.filtroRuc.set(null);
    this.getDocumentosEnviadosByRuc(ruc).subscribe(resp => {
      this._documentosEnviados.set(resp);
      this.ordenarDocumentosEnviadosPorFecha();
      this.procesando.set(false);
    });
  }
  ordenarDocumentosEnviadosPorFecha() {
    this._documentosEnviados.update(docs => docs.sort((a, b) => a.fechaDocumento < b.fechaDocumento ? 1 : -1));
  }

  getDocumentosEnviadosByRuc(ruc: string): Observable<any> {
    const url = this.getUrlEndpointService.getUrlFromEndPointName('promotick') + '/getDocumentosEnviados/' + ruc;
    return this.http.get<any>(url);
  }

  getNotasDeCreditoEnviadas(fecha: string): Observable<response> {
    const url = this.getUrlEndpointService.getUrlFromEndPointName('promotick') + '/getNotasDeCreditoEnviadas/' + fecha;
    return this.http.get<response>(url);
  }

  consultarNotasDeCreditoEnviadas(fecha: string) {
    this.procesando.set(true);
    this.filtroRuc.set(null);
    this._documentosEnviados.set([]);
    this.getNotasDeCreditoEnviadas(fecha).subscribe(
      {
        next: resp => {
          this._documentosEnviados.set(resp.datos as documentosEnviadosResponse[]);
          this.procesando.set(false);
        }
        , error: (err) => {
          this.procesando.set(false);
          console.log(err);
          this.sweetAlert.error('Error', 'Ocurrió un error al intentar obtener los documentos');

        },
      });

  }
}