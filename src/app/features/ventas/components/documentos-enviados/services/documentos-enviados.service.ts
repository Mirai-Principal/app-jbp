import { computed, inject, Injectable, signal } from '@angular/core';
import { PromotickServices } from '../../../participantes-puntos/services/promotick.service';
import { DocumentoEnviadoMsg } from '../../../../../core/models/documentoEnviadoMsg';
import { Observable } from 'rxjs';
import { GetUrlEndpointService } from '../../../../../core/services/get-url-endpoint.service';
import { HttpClient } from '@angular/common/http';
import { documentosEnviadosResponse, response } from '../models/documentos-enviados.model';

@Injectable({
  providedIn: 'root',
})
export class DocumentosEnviadosService {
  private ptkService = inject(PromotickServices);
  private getUrlEndpointService = inject(GetUrlEndpointService);
  private http = inject(HttpClient);

  private readonly _documentosEnviados = signal<DocumentoEnviadoMsg[]>([]);

  // Filtro por tipo de documento
  readonly filtroTipoDocumento = signal<string | null>(null);

  // Tipos de documento únicos extraídos de los datos
  readonly tiposDocumentoUnicos = computed(() => {
    const tipos = this._documentosEnviados().map(d => (d as any).tipoDocumento);
    return [...new Set(tipos)].filter(Boolean).sort();
  });

  readonly documentosEnviados = computed(() => {
    const filtro = this.filtroTipoDocumento();
    const docs = this._documentosEnviados();
    if (!filtro) return docs;
    return docs.filter(d => (d as any).tipoDocumento === filtro);
  });
  procesando = signal(false);

  consultarDocumentosEnviados(ruc: string) {
    this.procesando.set(true);
    this.filtroTipoDocumento.set(null);
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
    this.filtroTipoDocumento.set(null);
    this._documentosEnviados.set([]);
    this.getNotasDeCreditoEnviadas(fecha).subscribe(resp => {
      this._documentosEnviados.set(resp.datos as documentosEnviadosResponse[]);
      this.procesando.set(false);
    });

  }
}