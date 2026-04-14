import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';
import { DocumentoEnviadoMsg } from '../msg/documentoEnviadoMsg';
import { PromotickServices } from './promotickServices';



@Injectable()
export class DocumentosEnviadosServices {
    
    documentosEnviados: DocumentoEnviadoMsg[];
    procesando: boolean;
    subscription: Subscription;
     
    constructor(
        private ptkService: PromotickServices
    ) {
        this.documentosEnviados=[];
    }
    
    consultarDocumentosEnviados(ruc: string) {
        this.procesando=true;
        this.subscription =this.ptkService.getDocumentosEnviadosByRuc(ruc).subscribe(resp=>{
            this.procesando=false;
            this.documentosEnviados=resp;
            this.ordenarDocumentosEnviadosPorFecha();
            this.subscription.unsubscribe();
          });
    }
    ordenarDocumentosEnviadosPorFecha(){
        this.documentosEnviados.sort((a,b)=> a.fechaDocumento<b.fechaDocumento?1:-1);
    }
    
}
