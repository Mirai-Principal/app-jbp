import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GetUrlEndpointService } from '../../../../core/services/get-url-endpoint.service';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Participante } from '../models/actualizar-paticipantes';

@Injectable({
  providedIn: 'root',
})
export class ActualizarParticipantesService {
  //DI
  private http = inject(HttpClient);
  private getUrlEndpointService = inject(GetUrlEndpointService);

  getParticipantesPorActualizar(): Observable<Participante[]> {
    // Mock data for testing
    const mockData: Participante[] = [
      {
        revisado: false,
        Activo: true,
        apellidos: 'Pérez',
        celular: '999888777',
        clave: 'clave123',
        Comentario: {},
        Elite: false,
        email: 'juan.perez@example.com',
        estado: 1,
        nombreComercial: 'Juan Pérez Comercial',
        documentos: [
          {
            fechaDocumento: '2024-01-15',
            mesDocumento: '01',
            numDocumento: '001-001-0000001',
            ruc: '12345678901',
            rucPrincipal: '12345678901',
            monto: '1000.00',
            puntos: '100',
            tipoDocumento: 'Factura'
          }
        ],
        usuarioVendedor: 'vendedor1',
        fechaNacimiento: '1990-05-20',
        idCatalogo: 1,
        metaAnual: 50000,
        nombres: 'Juan',
        nroDocumento: '12345678901',
        NroDocumentoAnterior: '',
        RucPrincipal: '12345678901',
        telefono: '999888777',
        tipoCatalogo: 1,
        tipoDocumento: 1,
        tipoGenero: 1,
        vendedor: 'VEN001',
        Error: '',
        vendedorStr: 'Vendedor 1',
        correoVendedor: 'vendedor1@example.com',
        idVendedor: '1'
      },
      {
        revisado: false,
        Activo: true,
        apellidos: 'García',
        celular: '999777666',
        clave: 'clave456',
        Comentario: {},
        Elite: true,
        email: 'maria.garcia@example.com',
        estado: 1,
        nombreComercial: 'María García Comercial',
        documentos: [
          {
            fechaDocumento: '2024-01-20',
            mesDocumento: '01',
            numDocumento: '001-001-0000002',
            ruc: '98765432109',
            rucPrincipal: '98765432109',
            monto: '2500.00',
            puntos: '250',
            tipoDocumento: 'Factura'
          }
        ],
        usuarioVendedor: 'vendedor2',
        fechaNacimiento: '1985-10-15',
        idCatalogo: 2,
        metaAnual: 75000,
        nombres: 'María',
        nroDocumento: '98765432109',
        NroDocumentoAnterior: '',
        RucPrincipal: '98765432109',
        telefono: '999777666',
        tipoCatalogo: 2,
        tipoDocumento: 1,
        tipoGenero: 2,
        vendedor: 'VEN002',
        Error: '',
        vendedorStr: 'Vendedor 2',
        correoVendedor: 'vendedor2@example.com',
        idVendedor: '2'
      },
      {
        revisado: false,
        Activo: true,
        apellidos: 'López',
        celular: '999666555',
        clave: 'clave789',
        Comentario: {},
        Elite: false,
        email: 'carlos.lopez@example.com',
        estado: 1,
        nombreComercial: 'Carlos López Comercial',
        documentos: [
          {
            fechaDocumento: '2024-02-01',
            mesDocumento: '02',
            numDocumento: '001-001-0000003',
            ruc: '45678912301',
            rucPrincipal: '45678912301',
            monto: '1500.00',
            puntos: '150',
            tipoDocumento: 'Factura'
          }
        ],
        usuarioVendedor: 'vendedor1',
        fechaNacimiento: '1992-03-10',
        idCatalogo: 1,
        metaAnual: 60000,
        nombres: 'Carlos',
        nroDocumento: '45678912301',
        NroDocumentoAnterior: '',
        RucPrincipal: '45678912301',
        telefono: '999666555',
        tipoCatalogo: 1,
        tipoDocumento: 1,
        tipoGenero: 1,
        vendedor: 'VEN001',
        Error: '',
        vendedorStr: 'Vendedor 1',
        correoVendedor: 'vendedor1@example.com',
        idVendedor: '1'
      }
    ];

    return of(mockData);

    // Uncomment for real API call:
    // const url = this.getUrlEndpointService.getUrlFromEndPointName('promotick') + '/' + 'getParticipantesPorActualizar';
    // return this.http.get<Participante[]>(url);
  }

  actualizacionMasivaParticipantes(): Observable<any> {
    // Mock data for testing with delay
    const mockResponse = {
      success: true,
      message: 'Actualización masiva completada exitosamente',
      datos: {
        totalProcesados: 150,
        actualizados: 145,
        errores: 5,
        detallesErrores: [
          { id: 10, error: 'Email inválido' },
          { id: 25, error: 'RUC duplicado' }
        ]
      }
    };

    return of("Actualización completada").pipe(delay(2000));

    // Uncomment for real API call:
    // const url = this.getUrlEndpointService.getUrlFromEndPointName('promotick') + '/' + 'actualizacionMasivaParticipantes';
    // return this.http.get<any>(url);
  }

}
