# SweetAlert Service

## Uso

```typescript
// Inyectar el servicio
private sweetAlert = inject(SweetAlertService);

// Alertas simples
this.sweetAlert.success('Éxito', 'Operación completada');
this.sweetAlert.error('Error', 'Ocurrió un problema');
this.sweetAlert.warning('Advertencia', 'Verifique los datos');
this.sweetAlert.info('Información', 'Mensaje informativo');

// Confirmación
this.sweetAlert.confirm({
  title: '¿Está seguro?',
  message: 'Esta acción no se puede deshacer',
  type: 'warning'
}).subscribe(result => {
  if (result) {
    // Usuario confirmó
  }
});

// Loading
this.sweetAlert.loading('Procesando', 'Espere por favor...');
```