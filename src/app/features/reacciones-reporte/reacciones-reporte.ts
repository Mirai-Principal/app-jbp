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
import { SweetAlertService } from '../../shared/alert/services/sweet-alert.service';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-reacciones-reporte',
  imports: [Header, MatCard, MatCardHeader, MatCardTitle,
    MatCardContent, MatIcon, ReactiveFormsModule, MatButtonModule,
    MatExpansionModule,
    LoaderPage],
  templateUrl: './reacciones-reporte.html',
  styleUrl: './reacciones-reporte.scss',
})
export class ReaccionesReporte {

  // DI
  private reaccionesReporteService = inject(ReaccionesReporteService);
  private sweetAlert = inject(SweetAlertService);


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
        this.sweetAlert.error('Error', 'Error al cargar reacciones');

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

  exportarExcel(): void {
    const data = this.reacciones();
    if (!data || data.length === 0) {
      this.sweetAlert.warning('Atención', 'No hay datos de reportes para exportar');
      return;
    }

    try {
      const wb: XLSX.WorkBook = XLSX.utils.book_new();

      // 1. Hoja Principal: Reportes Generales RAM / FT / EM
      const reportesData = data.map(item => {
        const medicamentosResumen = (item.medicamentos || [])
          .map(m => m.medicamento)
          .filter(Boolean)
          .join(', ');

        const reaccionesResumen = (item.reaccionesStr || []).join(', ');

        const sintomasResumen = (item.informacionesReaccion || [])
          .map(info => info.sintomas)
          .filter(Boolean)
          .join('; ');

        const estadoResumen = (item.informacionesReaccion || [])
          .map(info => info.estadoPersonaAfectada)
          .filter(Boolean)
          .join('; ');

        return {
          'Cód. Registro': item.idStr || item.id,
          'Fecha Registro': item.fechaRegistro || '',
          'Nombres': item.nombres || '',
          'Apellidos': item.apellidos || '',
          'Sexo': item.sexo || '',
          'Rango Edad': item.rangoEdad || '',
          'Altura (Cm)': item.alturaCm ?? '',
          'Peso (Kg)': item.pesoKg ?? '',
          'Quién Padeció': item.quienPadecioEnfermedad || '',
          'Padece Otra Enfermedad': item.padeceOtraEnfermedad ? 'Sí' : 'No',
          'Otra Enfermedad': item.otraEnfermedad || '',
          'Medicamentos Involucrados': medicamentosResumen || 'Ninguno registrado',
          'Reacciones Adversas': reaccionesResumen || 'Sin detalle',
          'Síntomas': sintomasResumen || '',
          'Estado Paciente': estadoResumen || '',
          'Notificador': item.notificador || '',
          'Mail Notificador': item.notificadorMail || '',
          'Teléfono Notificador': item.notificadorTelefono || ''
        };
      });

      const wsReportes: XLSX.WorkSheet = XLSX.utils.json_to_sheet(reportesData);
      wsReportes['!cols'] = this.calcularAnchoColumnas(reportesData);
      XLSX.utils.book_append_sheet(wb, wsReportes, 'Reportes RAM');

      // 2. Hoja Detallada: Medicamentos
      const medicamentosData: any[] = [];
      data.forEach(item => {
        (item.medicamentos || []).forEach(med => {
          medicamentosData.push({
            'Cód. Registro': item.idStr || item.id,
            'Paciente': `${item.nombres || ''} ${item.apellidos || ''}`.trim(),
            'Medicamento': med.medicamento || '',
            'Lote': med.lote || '',
            'Fecha Vencimiento': med.fechaVencimiento || '',
            'Para Qué Utilizó': med.paraQueUtilizo || '',
            'Posología': med.posologia || '',
            'Cantidad / Frecuencia': med.cantidadFrecuencia || '',
            'Vía Administración': med.viaAdministracion || '',
            '¿Qué Pasó con Medicamento?': med.quePasoConMedicamento || '',
            'Fecha Utilización': med.fechaUtilizacion || '',
            'Cuándo Dejó de Usar': med.cuandoDejoUsar || '',
            '¿Reacción Previa?': med.haVueltoReaccion ? 'Sí' : 'No'
          });
        });
      });

      if (medicamentosData.length > 0) {
        const wsMedicamentos: XLSX.WorkSheet = XLSX.utils.json_to_sheet(medicamentosData);
        wsMedicamentos['!cols'] = this.calcularAnchoColumnas(medicamentosData);
        XLSX.utils.book_append_sheet(wb, wsMedicamentos, 'Detalle Medicamentos');
      }

      // 3. Hoja Detallada: Reacciones y Evolución
      const reaccionesDetalleData: any[] = [];
      data.forEach(item => {
        const reaccionesStr = (item.reaccionesStr || []).join(', ');
        (item.informacionesReaccion || []).forEach(info => {
          reaccionesDetalleData.push({
            'Cód. Registro': item.idStr || item.id,
            'Paciente': `${item.nombres || ''} ${item.apellidos || ''}`.trim(),
            'Reacciones Adversas': reaccionesStr || '',
            'Síntomas': info.sintomas || '',
            'Estado Persona Afectada': info.estadoPersonaAfectada || '',
            'Fecha Inicio': info.fechaInicio || '',
            'Fecha Fin': info.fechaFin || '',
            '¿Siguió Tratamiento?': info.siguiioTratamiento ? 'Sí' : 'No',
            'Descripción Tratamiento': info.tratamiento || ''
          });
        });
      });

      if (reaccionesDetalleData.length > 0) {
        const wsReacciones: XLSX.WorkSheet = XLSX.utils.json_to_sheet(reaccionesDetalleData);
        wsReacciones['!cols'] = this.calcularAnchoColumnas(reaccionesDetalleData);
        XLSX.utils.book_append_sheet(wb, wsReacciones, 'Evolución y Tratamiento');
      }

      // Generar buffer y descargar archivo
      const excelBuffer: any = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const blob: Blob = new Blob([excelBuffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
      });

      const fechaHoy = new Date().toISOString().slice(0, 10);
      const nombreArchivo = `Reporte_Reacciones_FOR-ARH-011_${fechaHoy}.xlsx`;
      saveAs(blob, nombreArchivo);

      this.sweetAlert.success('Reporte Exportado', `Se ha generado el archivo ${nombreArchivo} exitosamente.`);
    } catch (error) {
      console.error('Error al exportar a Excel:', error);
      this.sweetAlert.error('Error', 'Ocurrió un error al generar el reporte Excel.');
    }
  }

  private calcularAnchoColumnas(data: any[]): { wch: number }[] {
    if (!data || data.length === 0) return [];
    const keys = Object.keys(data[0]);
    return keys.map(key => {
      let maxLen = key.length;
      for (const row of data) {
        const val = row[key];
        const strVal = val != null ? String(val) : '';
        if (strVal.length > maxLen) {
          maxLen = strVal.length;
        }
      }
      return { wch: Math.min(Math.max(maxLen + 3, 12), 50) };
    });
  }

}
