import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ItemMsg, ListMe } from '../../../core/models/common.msg';
import { UrlServices } from '../../../assets/enviroment';

@Injectable({
  providedIn: 'root',
})
export class CuentasService {
  private http = inject(HttpClient);

  getList(): Observable<number> {
    const url = UrlServices.cuentaUrl + '/test';
    return this.http.get<number>(url);
  }

  getPeriodos(): Observable<ListMe<ItemMsg>> {
    const url = UrlServices.periodoUrl + '/getList';
    return this.http.get<ListMe<ItemMsg>>(url);
  }

}
