import { Component, Input, ViewChild, AfterViewInit, OnChanges, TemplateRef } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatIcon } from "@angular/material/icon";

export interface TableColumn {
  columnDef: string;
  header: string;
  cell?: (element: any) => string;
}

@Component({
  selector: 'app-table',
  imports: [CommonModule, FormsModule, MatTableModule, MatCheckboxModule, MatPaginatorModule, MatIcon],
  templateUrl: './table.html',
  styleUrls: ['./table.scss'],
})
export class Table implements AfterViewInit, OnChanges {
  @Input() data: any[] = [];
  @Input() columns: TableColumn[] = [];
  @Input() displayedColumns: string[] = [];
  @Input() showSelectAll: boolean = false;
  @Input() selectAll: (checked: boolean) => void = () => { };
  @Input() showPaginator: boolean = true;
  @Input() pageSizeOptions: number[] = [10, 15, 20];
  @Input() cellTemplate: TemplateRef<{ column: TableColumn; element: any }> | null = null;

  dataSource = new MatTableDataSource<any>([]);
  private previousData: any[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.updateDataSource();
  }

  ngOnChanges() {
    // Only update if data actually changed to prevent infinite loops
    if (JSON.stringify(this.data) !== JSON.stringify(this.previousData)) {
      this.previousData = [...this.data];
      this.updateDataSource();
    }
  }

  private updateDataSource() {
    if (this.dataSource) {
      this.dataSource.data = this.data || [];
      // Use setTimeout to ensure paginator is available after DOM update
      setTimeout(() => {
        if (this.paginator) {
          this.dataSource.paginator = this.paginator;
        }
      });
    }
  }
}
