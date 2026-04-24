import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NotaCreditoRequest, NotaCreditoItemResponse } from '../models/nota-credito.model';
import { GetUrlEndpointService } from '../../../core/services/get-url-endpoint.service';

@Injectable({
  providedIn: 'root'
})
export class NotaCreditoService {
  private http = inject(HttpClient);
  private getUrlEndpointService = inject(GetUrlEndpointService);

  private readonly API_URL = this.getUrlEndpointService.getUrlFromEndPointName('promotick') + "/setNcManuales";

  // cálculo de puntos
  calcularPuntos(monto: number, FactorConversionPuntos: number): number {
    return Math.round(monto) * FactorConversionPuntos;
  }

  enviarNotaCredito(datos: NotaCreditoItemResponse[]): Observable<any> {
    console.log(datos);
    return this.http.post(`${this.API_URL}`, datos);
  }
}