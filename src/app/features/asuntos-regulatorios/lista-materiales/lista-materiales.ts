import { Component, inject, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { finalize } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { Header } from '../../../shared/header/header';
import { BuscadorUniversal } from '../../../shared/buscador-universal';
import { Table, TableColumn } from '../../../shared/table/table';
import { ListaMaterialesService } from './lista-materiales.service';
import { listaMateriales, ProductTreeLines, producto } from './lista-materiales.model';
import { LoaderPage } from '../../../shared/loader-page/loader-page';
import { SweetAlertService } from '../../../shared/alert/services/sweet-alert.service';

@Component({
  selector: 'app-lista-materiales',
  imports: [
    CommonModule,
    Header,
    MatCard,
    MatCardContent,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    BuscadorUniversal,
    Table,
    LoaderPage
],
  templateUrl: './lista-materiales.html',
  styleUrl: './lista-materiales.scss',
})
export class ListaMateriales implements OnDestroy {
  // DI
  private readonly listaMaterialesService = inject(ListaMaterialesService);
  private readonly sweetAlert = inject(SweetAlertService);
  private detalleSubscription?: Subscription;

  readonly productoSeleccionado = signal<producto | null>(null);
  readonly detalleListaMateriales = signal<listaMateriales['data'] | null>(null);
  readonly materiales = signal<ProductTreeLines[]>([]);
  readonly cargandoDetalle = signal<boolean>(false);

  // Estados de edición en línea
  readonly editandoChildNum = signal<number | null>(null);
  readonly valorEditandoCantidad = signal<number | null>(null);
  readonly guardandoChildNum = signal<number | null>(null);
  readonly eliminandoChildNum = signal<number | null>(null);

  // Formato para mostrar cantidades
  formatCantidad(qty: number | undefined | null): string {
    if (qty === undefined || qty === null) return '-';
    return Number(qty).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 6 });
  }

  // Configuración de columnas para app-table
  readonly columns: TableColumn[] = [
    { columnDef: 'ItemCode', header: 'Código' },
    { columnDef: 'ItemName', header: 'Descripción del Material' },
    {
      columnDef: 'Quantity',
      header: 'Cantidad',
      cell: (element: ProductTreeLines) => this.formatCantidad(element.Quantity),
    },
    {
      columnDef: 'Warehouse',
      header: 'Almacén',
      cell: (element: ProductTreeLines) => element.Warehouse || '-',
    },
    {
      columnDef: 'Acciones',
      header: 'Acciones',
    },
  ];

  readonly displayedColumns: string[] = this.columns.map((c) => c.columnDef);

  // Función de búsqueda delegada al servicio del componente
  buscarMaterialFn = (producto: string) => this.listaMaterialesService.searchMaterial(producto);

  // Formato de subtítulo para el buscador universal
  readonly subtituloMaterial = (item: producto) => (item?.TreeCode ? `Código: ${item.TreeCode}` : '');

  ngOnDestroy(): void {
    this.detalleSubscription?.unsubscribe();
  }

  iniciarEdicion(element: ProductTreeLines): void {
    this.editandoChildNum.set(element.ChildNum ?? 0);
    this.valorEditandoCantidad.set(element.Quantity);
  }

  cancelarEdicion(): void {
    this.editandoChildNum.set(null);
    this.valorEditandoCantidad.set(null);
  }

  guardarEdicion(element: ProductTreeLines): void {
    const treeCode = this.productoSeleccionado()?.TreeCode;
    const childNum = element.ChildNum;
    const nuevaCantidad = this.valorEditandoCantidad();

    if (!treeCode) {
      this.sweetAlert.error('Error', 'No hay un producto seleccionado.');
      return;
    }

    if (childNum === undefined || childNum === null) {
      this.sweetAlert.error('Error', 'No se encontró el identificador de la línea.');
      return;
    }

    if (nuevaCantidad === null || nuevaCantidad === undefined || isNaN(nuevaCantidad) || nuevaCantidad <= 0) {
      this.sweetAlert.warning('Cantidad inválida', 'La cantidad debe ser un número mayor a 0.');
      return;
    }

    if (Number(nuevaCantidad) === Number(element.Quantity)) {
      this.cancelarEdicion();
      return;
    }

    this.guardandoChildNum.set(childNum);

    this.listaMaterialesService
      .updateQuantity(treeCode, childNum, nuevaCantidad)
      .pipe(finalize(() => this.guardandoChildNum.set(null)))
      .subscribe({
        next: (res: any) => {
          this.materiales.update((items) =>
            items.map((item) =>
              item.ChildNum === childNum ? { ...item, Quantity: nuevaCantidad } : item
            )
          );
          this.cancelarEdicion();
          this.sweetAlert.success('Cantidad actualizada', res?.message);
        },
        error: (err) => {
          console.error('Error al actualizar cantidad:', err);
          const errorMsg =
            err?.error?.message ||
            err?.error?.error ||
            err?.message ||
            'Ocurrió un error al actualizar la cantidad.';
          this.sweetAlert.error('Error al actualizar', errorMsg);
        },
      });
  }

  eliminarLinea(element: ProductTreeLines): void {
    const treeCode = this.productoSeleccionado()?.TreeCode;
    const childNum = element.ChildNum;

    if (!treeCode) {
      this.sweetAlert.error('Error', 'No hay un producto seleccionado.');
      return;
    }

    if (childNum === undefined || childNum === null) {
      this.sweetAlert.error('Error', 'No se encontró el identificador de la línea.');
      return;
    }

    if (this.materiales().length <= 1) {
      this.sweetAlert.warning(
        'Acción no permitida',
        'La lista de materiales debe tener al menos un componente. No se puede eliminar la única línea restante.'
      );
      return;
    }

    const itemDesc = element.ItemName ? `${element.ItemCode} - ${element.ItemName}` : element.ItemCode;

    this.sweetAlert
      .confirm({
        title: '¿Eliminar componente?',
        message: `¿Estás seguro de que deseas eliminar el componente "${itemDesc}"?`,
        type: 'warning',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
      })
      .subscribe((confirmed) => {
        if (confirmed) {
          if (this.editandoChildNum() === childNum) {
            this.cancelarEdicion();
          }

          this.eliminandoChildNum.set(childNum);

          this.listaMaterialesService
            .deleteProductTreeLine(treeCode, childNum)
            .pipe(finalize(() => this.eliminandoChildNum.set(null)))
            .subscribe({
              next: (res: any) => {
                this.materiales.update((items) =>
                  items.filter((item) => item.ChildNum !== childNum)
                );
                this.sweetAlert.success('Eliminado', res?.message);
              },
              error: (err) => {
                console.error('Error al eliminar componente:', err);
                const errorMsg =
                  err?.error?.message ||
                  err?.error?.error ||
                  err?.message ||
                  'Ocurrió un error al eliminar el componente de la lista de materiales.';
                this.sweetAlert.error('Error al eliminar', errorMsg);
              },
            });
        }
      });
  }

  onProductoSeleccionado(producto: producto | null): void {
    if (!producto) {
      this.onLimpiar();
      return;
    }

    this.productoSeleccionado.set(producto);
    this.cargandoDetalle.set(true);
    this.cancelarEdicion();
    this.detalleSubscription?.unsubscribe();

    this.detalleSubscription = this.listaMaterialesService
      .getListaMaterialesPorProducto(producto.TreeCode)
      .pipe(finalize(() => this.cargandoDetalle.set(false)))
      .subscribe({
        next: (res: any) => {
          console.log('Detalle lista materiales:', res);
          const info = res?.data;
          this.detalleListaMateriales.set(info ?? null);
          const rawLines = info?.materiales ?? info?.ProductTreeLines ?? [];
          const lines: ProductTreeLines[] = rawLines.map((line: any, index: number) => ({
            ...line,
            ChildNum: line.ChildNum !== undefined && line.ChildNum !== null ? Number(line.ChildNum) : index,
          }));
          this.materiales.set(lines);
        },
        error: (err) => {
          console.error('Error al obtener lista de materiales:', err);
          this.materiales.set([]);
          this.detalleListaMateriales.set(null);
        },
      });
  }

  onLimpiar(): void {
    this.detalleSubscription?.unsubscribe();
    this.cargandoDetalle.set(false);
    this.productoSeleccionado.set(null);
    this.detalleListaMateriales.set(null);
    this.materiales.set([]);
    this.cancelarEdicion();
    this.guardandoChildNum.set(null);
    this.eliminandoChildNum.set(null);
  }
}
