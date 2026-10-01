import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { Header } from '../../../shared/header/header';
import { BuscadorUniversal } from '../../../shared/buscador-universal';
import { ListaMaterialesService } from './lista-materiales.service';

@Component({
  selector: 'app-lista-materiales',
  imports: [
    Header,
    MatCard,
    MatCardContent,
    ReactiveFormsModule,
    MatInputModule,
    BuscadorUniversal,
  ],
  templateUrl: './lista-materiales.html',
  styleUrl: './lista-materiales.scss',
})
export class ListaMateriales {
  private readonly listaMaterialesService = inject(ListaMaterialesService);

  readonly materialSeleccionado = signal<any | null>(null);

  // Función de búsqueda delegada al servicio del componente
  buscarMaterialFn = (producto: string) => this.listaMaterialesService.searchMaterial(producto);

  // Formato de subtítulo para el buscador universal
  readonly subtituloMaterial = (item: any) => (item?.TreeCode ? `Código: ${item.TreeCode}` : '');

  onMaterialSeleccionado(material: any): void {
    this.materialSeleccionado.set(material);
    console.log('Material seleccionado:', material);
  }
}
