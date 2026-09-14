import { Component, Inject, OnInit } from '@angular/core';
import { Header } from '../../../../shared/header/header';
import { MatCard, MatCardContent } from '@angular/material/card';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { Contacto as ContactoModel } from '../../directorio-telefonico.model';
import { DirectorioTelefonicoService } from '../../services/directorio-telefonico.service';

@Component({
  selector: 'app-contacto',
  imports: [
    CommonModule,
    Header,
    ReactiveFormsModule,
    MatInputModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatAutocompleteModule
  ],
  templateUrl: './contacto.html',
  styleUrl: './contacto.scss',
})
export class Contacto implements OnInit {
  contactoForm!: FormGroup;
  isEditMode = false;
  plantas: string[] = [];
  filteredPlantas!: Observable<string[]>;
  departamentos: string[] = [];
  filteredDepartamentos!: Observable<string[]>;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<Contacto>,
    @Inject(MAT_DIALOG_DATA) public data: ContactoModel | null,
    private directorioService: DirectorioTelefonicoService
  ) {}

  ngOnInit(): void {
    this.isEditMode = !!this.data && !!this.data.ID;
    this.initForm();
    
    this.filteredPlantas = this.contactoForm.get('PLANTA')!.valueChanges.pipe(
      startWith(''),
      map(value => this._filterPlantas(value || ''))
    );

    this.filteredDepartamentos = this.contactoForm.get('DEPARTAMENTO')!.valueChanges.pipe(
      startWith(''),
      map(value => this._filterDepartamentos(value || ''))
    );

    this.cargarDatosDropdown();
  }

  private cargarDatosDropdown(): void {
    this.directorioService.getDirectorio().subscribe({
      next: (contactos) => {
        this.plantas = [...new Set(contactos.map(c => c.PLANTA).filter(p => !!p))].sort((a, b) => a.localeCompare(b));
        this.contactoForm.get('PLANTA')?.updateValueAndValidity({ emitEvent: true });
        
        this.departamentos = [...new Set(contactos.map(c => c.DEPARTAMENTO).filter(p => !!p))].sort((a, b) => a.localeCompare(b));
        this.contactoForm.get('DEPARTAMENTO')?.updateValueAndValidity({ emitEvent: true });
      },
      error: (err) => console.error('Error cargando datos para autocomplete', err)
    });
  }

  private _filterPlantas(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.plantas.filter(planta => planta.toLowerCase().includes(filterValue));
  }

  private _filterDepartamentos(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.departamentos.filter(depto => depto.toLowerCase().includes(filterValue));
  }

  private initForm(): void {
    this.contactoForm = this.fb.group({
      CONTACTO: [this.data?.CONTACTO || '', [Validators.required, Validators.maxLength(100)]],
      DEPARTAMENTO: [this.data?.DEPARTAMENTO || '', [Validators.required, Validators.maxLength(100)]],
      PLANTA: [this.data?.PLANTA || '', [Validators.required, Validators.maxLength(100)]],
      Ext: [this.data?.Ext || '', [Validators.required, Validators.maxLength(10)]],
    });
  }

  onSave(): void {
    if (this.contactoForm.valid) {
      const formValue = this.contactoForm.value;
      const result: ContactoModel = {
        ...formValue,
      };
      if (this.isEditMode && this.data?.ID) {
        result.ID = this.data.ID;
      }
      this.dialogRef.close(result);
    } else {
      this.contactoForm.markAllAsTouched();
    }
  }

  onCancel(): void {
    this.dialogRef.close(null);
  }
}
