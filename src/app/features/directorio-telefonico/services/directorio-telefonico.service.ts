import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { GetUrlEndpointService } from '../../../core/services/get-url-endpoint.service';

@Injectable({
  providedIn: 'root',
})
export class DirectorioTelefonicoService {

  constructor(private http: HttpClient, private getUrlEndpointService: GetUrlEndpointService) { }

  getDirectorio(): Observable<any> {
    const url = this.getUrlEndpointService.getUrlFromEndPointName('directorio');
    return this.http.get<any>(url!);
  }
}
