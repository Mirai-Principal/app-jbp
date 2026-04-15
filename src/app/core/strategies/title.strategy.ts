import { Injectable } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { TitleStrategy, RouterStateSnapshot } from '@angular/router';
import { enviroment } from '../../assets/enviroment';

//? Estrategia personalizada para el título y descripción de la página
@Injectable({ providedIn: 'root' })
export class AppTitleStrategy extends TitleStrategy {
  constructor(private title: Title, private meta: Meta) {
    super();
  }

  override updateTitle(routerState: RouterStateSnapshot) {
    // TITLE
    const pageTitle = this.buildTitle(routerState);

    if (pageTitle) {
      this.title.setTitle(`${pageTitle} | ${enviroment.empresaNombre}`);
    } else {
      this.title.setTitle(enviroment.empresaNombre);
    }

    // DESCRIPTION
    const route = this.getDeepestRoute(routerState.root);
    const description = route.data?.['description'];

    if (description) {
      this.meta.updateTag({
        name: 'description',
        content: description
      });
    }
  }

  // 🔥 helper para obtener la última ruta activa
  private getDeepestRoute(route: any): any {
    while (route.firstChild) {
      route = route.firstChild;
    }
    return route;
  }
}