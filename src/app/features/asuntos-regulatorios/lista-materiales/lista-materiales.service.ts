import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GetUrlEndpointService } from '../../../core/services/get-url-endpoint.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ListaMaterialesService {

    private readonly http = inject(HttpClient);
    private readonly endpoint = inject(GetUrlEndpointService);

    
    searchMaterial(producto: string): Observable<any> {
        const url = this.endpoint.service_layer + `listaMateriales?producto=${producto}`;
        return this.http.get<any>(url);
      }


}