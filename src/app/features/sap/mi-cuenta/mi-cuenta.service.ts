import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GetUrlEndpointService } from '../../../core/services/get-url-endpoint.service';

export interface CodigoImpresoraByUserResponse {
  username: string;
  codigoImpresora: string;
}

@Injectable({
  providedIn: 'root',
})
export class MiCuentaService {
  private readonly http = inject(HttpClient);
  private readonly getUrlEndpointService = inject(GetUrlEndpointService);

  getCodigoImpresoraByUser(username: string): Observable<CodigoImpresoraByUserResponse> {
    const url = `${this.getUrlEndpointService.getUrlFromEndPointName('user')}/getCodigoImpresoraByUser/${encodeURIComponent(username.trim())}`;
    return this.http.get<CodigoImpresoraByUserResponse>(url);
  }
}
