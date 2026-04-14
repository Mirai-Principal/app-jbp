import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UrlServices } from '../global';
import { ItemMsg, ListMe } from '../msg/common.msg';

@Injectable()
export class CuentaService {
    constructor(private http: HttpClient) {}
    getList(): Observable<number> {
      const url = UrlServices.cuentaUrl + '/test';
      return this.http.get<number>(url);
    }
}
