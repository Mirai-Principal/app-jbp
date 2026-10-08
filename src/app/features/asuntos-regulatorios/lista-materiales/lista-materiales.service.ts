import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GetUrlEndpointService } from '../../../core/services/get-url-endpoint.service';
import { Observable } from 'rxjs';
import { listaMateriales } from './lista-materiales.model';

@Injectable({
  providedIn: 'root',
})
export class ListaMaterialesService {

    private readonly http = inject(HttpClient);
    private readonly endpoint = inject(GetUrlEndpointService);

    
    searchMaterial(producto: string): Observable<listaMateriales> {
        const url = this.endpoint.service_layer + `lista-materiales/buscar-producto?producto=${producto}`;
        return this.http.get<listaMateriales>(url);
    }

    getListaMaterialesPorProducto(treeCode: string): Observable<listaMateriales> {
        const url = this.endpoint.service_layer + `lista-materiales/${treeCode}`;
        return this.http.get<listaMateriales>(url);
    }

    updateQuantity(treeCode: string, childNum: number, quantity: number): Observable<void> {
        const url = this.endpoint.service_layer + `lista-materiales/${treeCode}`;
        const body = { ChildNum: childNum, Quantity: quantity };
        return this.http.patch<void>(url, body);
    }

    deleteProductTreeLine(treeCode: string, childNum: number): Observable<void> {
        const url = this.endpoint.service_layer + `lista-materiales/${treeCode}/${childNum}`;
        return this.http.delete<void>(url);
    }


}