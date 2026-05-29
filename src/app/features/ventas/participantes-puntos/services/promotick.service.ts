import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GetUrlEndpointService } from '../../../../core/services/get-url-endpoint.service';
import { Promotick } from '../../../../core/models/confMsg';
import { HttpHeaders } from '@angular/common/http';



@Injectable({
  providedIn: 'root',
})
export class PromotickServices {
  // DI
  private readonly http = inject(HttpClient);
  private readonly getUrlEndpointService = inject(GetUrlEndpointService);

  getEstadoCuentaByRuc(ruc: string): Observable<any> {
    const url = this.getUrlEndpointService.getUrlFromEndPointName('promotick') + '/getEstadoCuenta/' + ruc;
    console.log(url);
    return this.http.get<any>(url);
  }

  getHeaderWsPromotick(ptkConf: Promotick): any {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + btoa(ptkConf.User + ':' + ptkConf.Pwd)
      })
    };
    return httpOptions;
  }
}