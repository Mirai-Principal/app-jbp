import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GetUrlEndpointService } from '../../../core/services/get-url-endpoint.service';
import { UsuariosSapResponse } from './usuarios.model';

@Injectable({
  providedIn: 'root',
})
export class UsuariosService {
  //DI
  private readonly http = inject(HttpClient);
  private readonly getUrlEndpointService = inject(GetUrlEndpointService);

  getUsuarios(): Observable<UsuariosSapResponse> {
    const url = this.getUrlEndpointService.service_layer + 'Users';
    return this.http.get<UsuariosSapResponse>(url);
  }
}
