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
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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

  async exportarPdfRegistro(item: ReaccionesReporteResponse): Promise<void> {
    try {
      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pageWidth = doc.internal.pageSize.getWidth();
      const codRegistro = item.idStr || String(item.id);

      // Encabezado Institucional
      doc.setFillColor(63, 81, 181);
      doc.rect(0, 0, pageWidth, 28, 'F');

      const logoImg = await this.cargarImagen('logoOriginal.png');
      let textStartX = 14;
      if (logoImg) {
        doc.setFillColor(255, 255, 255);
        doc.roundedRect(12, 3, 28, 22, 2, 2, 'F');
        doc.addImage(logoImg, 'PNG', 13.5, 4, 25, 20);
        textStartX = 44;
      }

      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text('REPORTE DE REACCIONES ADVERSAS', textStartX, 12);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.text('FOR-ARH-011', textStartX, 19);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text(`Cód. Registro: ${codRegistro}`, pageWidth - 14, 12, { align: 'right' });
      doc.setFont('helvetica', 'normal');
      doc.text(`Fecha Registro: ${item.fechaRegistro || '-'}`, pageWidth - 14, 19, { align: 'right' });

      let currentY = 36;

      // 1. Datos Generales del Paciente y Notificador
      doc.setTextColor(44, 62, 80);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.text('1. Datos del Paciente y Notificador', 14, currentY);
      currentY += 3;

      const otraEnfTexto = item.padeceOtraEnfermedad
        ? `Sí${item.otraEnfermedad ? ' - ' + item.otraEnfermedad : ''}`
        : 'No';

      autoTable(doc, {
        startY: currentY,
        theme: 'grid',
        styles: { fontSize: 9, cellPadding: 2.5, textColor: [44, 62, 80] },
        columnStyles: {
          0: { fontStyle: 'bold', fillColor: [245, 247, 250], cellWidth: 42 },
          1: { cellWidth: 49 },
          2: { fontStyle: 'bold', fillColor: [245, 247, 250], cellWidth: 42 },
          3: { cellWidth: 49 }
        },
        body: [
          ['Nombres:', item.nombres || '-', 'Apellidos:', item.apellidos || '-'],
          ['Rango de Edad:', item.rangoEdad || '-', 'Sexo:', item.sexo || '-'],
          ['Altura (Cm):', item.alturaCm != null ? `${item.alturaCm} cm` : '-', 'Peso (Kg):', item.pesoKg != null ? `${item.pesoKg} kg` : '-'],
          ['Quién Padeció:', item.quienPadecioEnfermedad || '-', 'Otra Enfermedad:', otraEnfTexto],
          ['Notificador:', item.notificador || '-', 'Teléfono:', item.notificadorTelefono || '-'],
          ['Correo Notificador:', { content: item.notificadorMail || '-', colSpan: 3 }]
        ]
      });

      currentY = (doc as any).lastAutoTable.finalY + 8;

      // 2. Medicamentos Involucrados
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(44, 62, 80);
      doc.text('2. Medicamentos Reportados', 14, currentY);
      currentY += 3;

      const meds = item.medicamentos || [];
      if (meds.length > 0) {
        autoTable(doc, {
          startY: currentY,
          theme: 'grid',
          headStyles: { fillColor: [63, 81, 181], textColor: 255, fontSize: 8, fontStyle: 'bold' },
          styles: { fontSize: 7.5, cellPadding: 2, overflow: 'linebreak' },
          head: [[
            'Medicamento', 'Lote', 'F. Venc.', 'Uso', 'Posología',
            'Frecuencia', 'Vía', '¿Qué pasó?', 'F. Uso', 'Dejó de usar', 'Reac. Previa'
          ]],
          body: meds.map(m => [
            m.medicamento || '-',
            m.lote || '-',
            m.fechaVencimiento || '-',
            m.paraQueUtilizo || '-',
            m.posologia || '-',
            m.cantidadFrecuencia || '-',
            m.viaAdministracion || '-',
            m.quePasoConMedicamento || '-',
            m.fechaUtilizacion || '-',
            m.cuandoDejoUsar || '-',
            m.haVueltoReaccion ? 'Sí' : 'No'
          ])
        });
        currentY = (doc as any).lastAutoTable.finalY + 8;
      } else {
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(9);
        doc.setTextColor(120, 120, 120);
        doc.text('No se registraron medicamentos asociados.', 14, currentY + 4);
        currentY += 10;
      }

      // 3. Reacciones Adversas
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(44, 62, 80);
      doc.text('3. Reacciones Adversas Presentadas', 14, currentY);
      currentY += 3;

      const reaccionesList = item.reaccionesStr || [];
      if (reaccionesList.length > 0) {
        autoTable(doc, {
          startY: currentY,
          theme: 'grid',
          headStyles: { fillColor: [220, 53, 69], textColor: 255, fontSize: 8.5, fontStyle: 'bold' },
          styles: { fontSize: 8.5, cellPadding: 2.5 },
          head: [['#', 'Reacción Adversa Reportada']],
          columnStyles: { 0: { cellWidth: 15, halign: 'center' } },
          body: reaccionesList.map((r, idx) => [String(idx + 1), r])
        });
        currentY = (doc as any).lastAutoTable.finalY + 8;
      } else {
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(9);
        doc.setTextColor(120, 120, 120);
        doc.text('Sin reacciones adversas listadas.', 14, currentY + 4);
        currentY += 10;
      }

      // 4. Información y Evolución de la Reacción
      if (currentY > 250) {
        doc.addPage();
        currentY = 20;
      }

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(44, 62, 80);
      doc.text('4. Información y Evolución de la Reacción', 14, currentY);
      currentY += 3;

      const infos = item.informacionesReaccion || [];
      if (infos.length > 0) {
        autoTable(doc, {
          startY: currentY,
          theme: 'grid',
          headStyles: { fillColor: [63, 81, 181], textColor: 255, fontSize: 8.5, fontStyle: 'bold' },
          styles: { fontSize: 8.5, cellPadding: 2.5 },
          head: [[
            'Síntomas', 'Estado Persona', 'Fecha Inicio',
            'Fecha Fin', 'Tratamiento', 'Descripción Tratamiento'
          ]],
          body: infos.map(info => [
            info.sintomas || '-',
            info.estadoPersonaAfectada || '-',
            info.fechaInicio || '-',
            info.fechaFin || '-',
            info.siguiioTratamiento ? 'Sí' : 'No',
            info.tratamiento || '-'
          ])
        });
      } else {
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(9);
        doc.setTextColor(120, 120, 120);
        doc.text('Sin detalles adicionales de evolución.', 14, currentY + 4);
      }

      // Pie de página con numeración
      const totalPages = doc.getNumberOfPages();
      const fechaImpresion = new Date().toLocaleString('es-EC');
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(`Generado el: ${fechaImpresion}`, 14, 290);
        doc.text(`Página ${i} de ${totalPages}`, pageWidth - 14, 290, { align: 'right' });
      }

      const nombreArchivo = `Reporte_${codRegistro}.pdf`;
      doc.save(nombreArchivo);
    } catch (error) {
      console.error('Error al generar PDF del registro:', error);
      this.sweetAlert.error('Error', 'Ocurrió un error al generar el PDF del registro.');
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

  private cargarImagen(url: string): Promise<HTMLImageElement | null> {
    return new Promise(resolve => {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.onload = () => resolve(img);
      img.onerror = () => resolve(null);
      img.src = url;
    });
  }

}
