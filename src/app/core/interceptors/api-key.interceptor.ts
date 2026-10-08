import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { GetUrlEndpointService } from '../services/get-url-endpoint.service';
import { apiKey } from '../../assets/conf';

export const apiKeyInterceptor: HttpInterceptorFn = (req, next) => {
  const getUrlEndpointService = inject(GetUrlEndpointService);

  // Inyectar el header 'x-api-key' si la petición va dirigida al backend de SAP (service_layer)
  if (apiKey && req.url.startsWith(getUrlEndpointService.service_layer)) {
    const headers = req.headers.has('x-api-key')
      ? req.headers
      : req.headers.set('x-api-key', apiKey);

    const clonedReq = req.clone({ headers });
    return next(clonedReq);
  }

  return next(req);
};
