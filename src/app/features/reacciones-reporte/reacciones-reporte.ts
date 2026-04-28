import { Component, computed, inject, signal } from '@angular/core';
import { Header } from "../../shared/header/header";
import { MatCard, MatCardHeader, MatCardTitle, MatCardContent } from "@angular/material/card";
import { MatIcon } from "@angular/material/icon";
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { ReaccionesReporteService } from './services/reacciones-reporte.service';
import { ReaccionesReporteResponse } from './models/reacciones-reporte.model';
import { LoaderPage } from "../../shared/loader-page/loader-page";
import { MatDialog } from '@angular/material/dialog';
import { Alert } from '../../shared/alert/alert';

@Component({
  selector: 'app-reacciones-reporte',
  imports: [Header, MatCard, MatCardHeader, MatCardTitle, MatCardContent, MatIcon, ReactiveFormsModule, MatButtonModule, MatExpansionModule, LoaderPage],
  templateUrl: './reacciones-reporte.html',
  styleUrl: './reacciones-reporte.scss',
})
export class ReaccionesReporte {

  // DI
  private reaccionesReporteService = inject(ReaccionesReporteService);
  private dialog = inject(MatDialog);

  // estados
  protected readonly reacciones = signal<ReaccionesReporteResponse[]>([]);
  protected readonly expandedItems = signal<Set<number>>(new Set());
  protected readonly isLoading = signal(false);

  constructor() {
    this.getReacciones();
  }

  getReacciones() {
    this.isLoading.set(true);
    this.reaccionesReporteService.getReacciones().subscribe({
      next: (reacciones) => {
        console.log(reacciones);
        this.reacciones.set(reacciones);
        this.isLoading.set(false);
      }
      , error: (error) => {
        console.error(error);
        this.isLoading.set(false);
        this.dialog.open(Alert, {
          data: {
            title: 'Error al cargar reacciones',
            message: "Error al cargar reacciones",
            type: 'error'
          }
        });
      }
    });
  }

  toggleExpansion(itemId: number) {
    const currentExpanded = this.expandedItems();
    const newExpanded = new Set(currentExpanded);

    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }

    this.expandedItems.set(newExpanded);
  }

  isExpanded(itemId: number): boolean {
    return this.expandedItems().has(itemId);
  }

}
