import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UrlServices } from '../global';
import { ItemMsg, ListMe } from '../msg/common.msg';

@Injectable()
export class PeriodoService {
    constructor(private http: HttpClient) {}
    getPeriodos(): Observable<ListMe<ItemMsg>> {
      const url = UrlServices.periodoUrl + '/getList';
      return this.http.get<ListMe<ItemMsg>>(url);
    }
}
