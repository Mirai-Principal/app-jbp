import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { GetUrlEndpointService } from '../../../core/services/get-url-endpoint.service';

@Injectable({
  providedIn: 'root',
})
export class DirectorioTelefonicoService {

  constructor(private http: HttpClient) { }

  getDirectorio(): Observable<any> {
    const url = GetUrlEndpointService.getUrlFromEndPointName('directorio');
    return this.http.get<any>(url!);
  }
}
