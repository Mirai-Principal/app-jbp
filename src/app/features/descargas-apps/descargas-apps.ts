import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Header } from '../../shared/header/header';
import { SweetAlertService } from '../../shared/alert/services/sweet-alert.service';

export interface ApkItem {
  id: string;
  name: string;
  version: string;
  fileName: string;
  fileSize: string;
  icon: string;
  description: string;
  tag: string;
  tagType: 'production' | 'test' | 'sales';
  features: string[];
}

@Component({
  selector: 'app-descargas-apps',
  imports: [
    CommonModule,
    Header,
    MatCard,
    MatCardContent,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './descargas-apps.html',
  styleUrl: './descargas-apps.scss'
})
export class DescargasApps {
  private sweetAlert = inject(SweetAlertService);

  copyLink(fileName: string) {
    const url = `${window.location.origin}/${fileName}`;
    navigator.clipboard.writeText(url).then(() => {
      this.sweetAlert.success('Enlace copiado', 'El enlace de descarga ha sido copiado al portapapeles');
    }).catch(err => {
      console.error('Error al copiar el enlace: ', err);
      this.sweetAlert.error('Error', 'No se pudo copiar el enlace');
    });
  }
  readonly apks: ApkItem[] = [
    {
      id: 'bodega-prod',
      name: 'JB Móvil Bodega',
      version: '3.5.1.0',
      fileName: 'jbMobilBodega_3.5.1.0.apk',
      fileSize: '30.5 MB',
      icon: 'inventory_2',
      description: 'Aplicación oficial para la gestión operativa en bodega, recepción de mercadería, control de ubicaciones, picking y transferencias',
      tag: 'Producción',
      tagType: 'production',
      features: [
        'Recepción y despacho de pedidos',
        'Gestión de ubicaciones y escaneo QR',
        'Sincronización directa con el ERP'
      ]
    },
    {
      id: 'ventas-prod',
      name: 'JB Móvil Ventas',
      version: '3.5.1.0',
      fileName: 'JbMobilVentas_3.5.1.0.apk',
      fileSize: '30.5 MB',
      icon: 'point_of_sale',
      description: 'App móvil para ventas. Permite la realizar toma de pedidos, consulta de catálogo de productos',
      tag: 'Producción',
      tagType: 'sales',
      features: [
        'Registro y seguimiento de pedidos',
        'Consulta de catálogo y precios actualizados',
        'Gestión de clientes y rutas comerciales'
      ]
    },
    {
      id: 'bodega-qa',
      name: 'JB Bodega (Pruebas)',
      version: '3.5.1.0',
      fileName: 'JbBodegaPruebas_3.5.1.0.apk',
      fileSize: '30.5 MB',
      icon: 'science',
      description: 'Versión de pruebas y validación para el módulo de bodega. Destinada a ensayos de nuevas funcionalidades antes de producción.',
      tag: 'Entorno Pruebas',
      tagType: 'test',
      features: [
        'Ambiente de pruebas / Sandbox',
        'Validación de nuevas versiones',
        'Simulación de procesos logísticos'
      ]
    }
  ];
}
