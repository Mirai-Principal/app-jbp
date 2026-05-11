import { Component, computed, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { DocumentosEnviadosService } from '../../services/documentos-enviados.service';
import { Table, TableColumn } from '../../../../../shared/table/table';

@Component({
  selector: 'app-documentos-enviados',
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    Table,
  ],
  templateUrl: './documentos-enviados.html',
  styleUrl: './documentos-enviados.scss',
})
export class DocumentosEnviados {
  // DI
  docEnviadosservice = inject(DocumentosEnviadosService);

  // estados
  documentos = computed(() => this.docEnviadosservice.documentosEnviados());

  // Columnas de la tabla
  columns: TableColumn[] = [
    { columnDef: 'tipoDocumento', header: 'Tipo Documento' },
    { columnDef: 'fechaEnvio', header: 'Fecha Envío' },
    { columnDef: 'fechaDocumento', header: 'Fecha Documento' },
    { columnDef: 'nroDocumento', header: 'Nro Documento' },
    { columnDef: 'monto', header: 'Monto' },
    { columnDef: 'puntos', header: 'Puntos' },
    { columnDef: 'codRespWS', header: 'Cod. Resp. WS' },
    { columnDef: 'respWs', header: 'Respuesta Ws' },
    { columnDef: 'fechaDocumentoOriginal', header: 'Fecha Documento Original' },
    { columnDef: 'descripcion', header: 'Descripción' },
  ];

  displayedColumns = this.columns.map(c => c.columnDef);

}
