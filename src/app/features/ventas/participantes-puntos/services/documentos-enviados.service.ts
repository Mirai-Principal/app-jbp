import { computed, inject, Injectable, signal } from '@angular/core';
import { PromotickServices } from './promotick.service';
import { DocumentoEnviadoMsg } from '../../../../core/models/documentoEnviadoMsg';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DocumentosEnviadosService {
  private ptkService = inject(PromotickServices);

  private readonly _documentosEnviados = signal<DocumentoEnviadoMsg[]>([]);
  readonly documentosEnviados = computed(() =>
    this._documentosEnviados()
  );
  procesando = signal(false);

  consultarDocumentosEnviados(ruc: string) {
    this.procesando.set(true);
    this.ptkService.getDocumentosEnviadosByRuc(ruc).subscribe(resp => {
      this._documentosEnviados.set(resp);
      this.ordenarDocumentosEnviadosPorFecha();
      this.procesando.set(false);
    });
  }
  ordenarDocumentosEnviadosPorFecha() {
    this._documentosEnviados.update(docs => docs.sort((a, b) => a.fechaDocumento < b.fechaDocumento ? 1 : -1));
  }

}
