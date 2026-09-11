import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Header } from '../../../shared/header/header';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Table, TableColumn } from '../../../shared/table/table';
import { LoaderPage } from '../../../shared/loader-page/loader-page';
import { UsuariosService } from './usuarios.service';
import { UsuarioSap } from './usuarios.model';
import { SweetAlertService } from '../../../shared/alert/services/sweet-alert.service';

@Component({
  selector: 'app-usuarios',
  imports: [
    CommonModule,
    FormsModule,
    Header,
    MatCard,
    MatCardContent,
    MatTabsModule,
    MatIcon,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    Table,
    LoaderPage,
  ],
  templateUrl: './usuarios.html',
  styleUrl: './usuarios.scss',
})
export class Usuarios implements OnInit {
  // DI
  private readonly usuariosService = inject(UsuariosService);
  private readonly sweetAlert = inject(SweetAlertService);

  // Estados
  readonly isLoading = signal<boolean>(false);
  readonly usuarios = signal<UsuarioSap[]>([]);
  readonly searchTerm = signal<string>('');
  readonly viewMode = signal<'tabs' | 'stacked'>('tabs');

  // Columnas de la tabla
  readonly columns: TableColumn[] = [
    { columnDef: 'InternalKey', header: 'ID Interno' },
    { columnDef: 'UserCode', header: 'Usuario SAP' },
    { columnDef: 'UserName', header: 'Nombre Completo' },
    {
      columnDef: 'Locked',
      header: 'Estado',
      cell: (u: UsuarioSap) => (u.Locked === 'tYES' ? 'Bloqueado' : 'Activo'),
    },
    {
      columnDef: 'LastLogoutDate',
      header: 'Último Cierre de Sesión',
      cell: (u: UsuarioSap) => this.formatDate(u.LastLogoutDate),
    },
  ];

  readonly displayedColumns: string[] = this.columns.map((c) => c.columnDef);

  // Filtro de búsqueda reactivo
  readonly filteredUsuarios = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    const list = this.usuarios();
    if (!term) return list;

    return list.filter(
      (u) =>
        (u.UserName && u.UserName.toLowerCase().includes(term)) ||
        (u.UserCode && u.UserCode.toLowerCase().includes(term)) ||
        String(u.InternalKey).includes(term)
    );
  });

  // Separación en dos tablas por estado
  readonly usuariosNoBloqueados = computed(() =>
    this.filteredUsuarios().filter((u) => u.Locked !== 'tYES')
  );

  readonly usuariosBloqueados = computed(() =>
    this.filteredUsuarios().filter((u) => u.Locked === 'tYES')
  );

  ngOnInit(): void {
    this.loadUsuarios();
  }

  loadUsuarios(): void {
    this.isLoading.set(true);
    this.usuariosService.getUsuarios().subscribe({
      next: (res) => {
        const list = res?.data?.value || [];
        this.usuarios.set(list);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error al cargar usuarios de SAP:', err);
        this.isLoading.set(false);
        this.sweetAlert.error('Error', 'No se pudieron cargar los usuarios de SAP');
      },
    });
  }

  formatDate(dateStr: string | null): string {
    if (!dateStr) return 'Sin registro';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('es-EC', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  }
}
