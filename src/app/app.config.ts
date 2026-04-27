import { ApplicationConfig, provideBrowserGlobalErrorListeners, LOCALE_ID } from '@angular/core';
import { provideRouter, TitleStrategy, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { provideHttpClient } from '@angular/common/http';
import { AppTitleStrategy } from './core/strategies/title.strategy';

//registramos los datos de localizacion para espaniol
registerLocaleData(localeEs, 'es');

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding()),  //el segundo permite recibir parámetros con input()
    provideHttpClient(), //proveedor de http para peticiones
    { provide: LOCALE_ID, useValue: 'es' }, //registramos el proveedor de localizacion
    {
      provide: TitleStrategy,
      useClass: AppTitleStrategy
    } //proveedor de estrategia de título

  ]
};