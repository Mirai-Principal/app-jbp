import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { GetUrlEndpointService } from '../../../core/services/get-url-endpoint.service';
import { Contacto } from '../directorio-telefonico.model';

@Injectable({
  providedIn: 'root',
})
export class DirectorioTelefonicoService {
  // DI
  private http = inject(HttpClient);
  private getUrlEndpointService = inject(GetUrlEndpointService);

  // variables privadas
  private readonly currentUser = localStorage.getItem('currentUser');
  readonly ModulosAcceso = JSON.parse(this.currentUser || '{}')?.ModulosAcceso || {};

  getDirectorio(): Observable<Contacto[]> {
    const url = this.getUrlEndpointService.getUrlFromEndPointName('directorio');
    return this.http.get<Contacto[]>(url!);
  }

  addContacto(contacto: Contacto): Observable<any> {
    const url = this.getUrlEndpointService.getUrlFromEndPointName('directorio');
    return this.http.post<any>(url!, contacto);
  }

  updateContacto(id: number, contacto: Contacto): Observable<any> {
    const url = this.getUrlEndpointService.getUrlFromEndPointName('directorio');
    return this.http.put<any>(url! + '/' + id, contacto);
  }

  deleteContacto(id: number): Observable<any> {
    const url = this.getUrlEndpointService.getUrlFromEndPointName('directorio');
    return this.http.delete<any>(url! + '/' + id);
  }
}
