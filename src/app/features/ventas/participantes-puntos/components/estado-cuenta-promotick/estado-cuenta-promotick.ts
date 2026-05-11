import { Component, inject, input, signal, effect } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatAccordion, MatExpansionPanel, MatExpansionPanelHeader, MatExpansionPanelTitle } from "@angular/material/expansion";
import { MatProgressSpinner } from "@angular/material/progress-spinner";
import { PromotickServices } from '../../services/promotick.service';
import { SocioNegocioService } from '../../services/socio-negocio.service';
import { DetalleEstadoCuentaMsg, EstadoCuentaMsg } from '../../../../../core/models/estadoCuentaMsg';

@Component({
  selector: 'app-estado-cuenta-promotick',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatAccordion,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle,
    MatProgressSpinner,
  ],
  templateUrl: './estado-cuenta-promotick.html',
  styleUrl: './estado-cuenta-promotick.scss'
})
export class EstadoCuentaPromotick {
  // DI
  private socioNegocioService = inject(SocioNegocioService);
  private ptkService = inject(PromotickServices);

  // estados
  participante = input<any>(null);
  procesando = signal(false);

  documentosPorMes: any[];
  metaMensual: number;
  estadoCuenta: EstadoCuentaMsg = new EstadoCuentaMsg();

  constructor() {
    this.documentosPorMes = [];
    this.metaMensual = 0;

    effect(() => {
      const participante = this.participante();
      if (participante) {
        this.loadDocumentosParticipante();
        //ordeno por el mes mas reciente
        if (this.documentosPorMes) {
          this.documentosPorMes.sort((a, b) => (a.mes < b.mes) ? 1 : -1)
        }
      }
    });
  }

  mostrarDetEstadoCuenta(det: DetalleEstadoCuentaMsg) {
    if (det.facturado == 0 && det.canjeado == 0 && det.acumulado == 0 && det.descargado == 0)
      return false;
    return true;
  }
  consultarEstadoCuentaByRuc(ruc: string) {
    this.procesando.set(true);
    let call = this.ptkService.getEstadoCuentaByRuc(ruc).subscribe(resp => {
      call.unsubscribe();
      this.procesando.set(false);
      this.estadoCuenta = JSON.parse(resp);
      if (this.estadoCuenta)
        this.ordenarEstadoCuenta();
    });
  }
  ordenarEstadoCuenta() {
    if (this.estadoCuenta.data && this.estadoCuenta.data.canjes) {
      this.estadoCuenta.data.canjes.sort((a, b) =>
        (a.idPedido < b.idPedido) ? 1 : -1
      );
    }
    if (this.estadoCuenta.data && this.estadoCuenta.data.detalleEstadoCuenta) {
      this.estadoCuenta.data.detalleEstadoCuenta.sort((a, b) =>
        (a.mes < b.mes) ? 1 : -1
      );
    }
  }
  loadDocumentosParticipante() {
    if (!this.participante()) return;
    // Reset data before loading new participant
    this.documentosPorMes = [];
    this.consultarEstadoCuentaByRuc(this.participante().RucPrincipal);
    this.metaMensual = this.participante().metaAnual / 12;
    this.participante().documentos.forEach((d: any) => {
      let mes = d.mesDocumento;
      if (!this.existeMes(mes)) {//agrego el mes en el arreglo
        let obj: any = {};
        obj.mes = mes;
        obj.documentos = [];
        obj.monto = 0;
        obj.puntos = 0;
        this.documentosPorMes.push(obj);
      }
      console.log(this.documentosPorMes);
      this.documentosPorMes.forEach(obj => {
        if (obj.mes == mes) {
          obj.monto += Number(d.monto);
          obj.paraCumplirMeta = this.getMontoRestante(obj.monto);
          obj.puntos += Number(d.puntos);
          obj.cumpleMetaMes = this.cumpleMetaMes(obj.monto);
          obj.documentos.push(d);
        }
      });
    });
  }
  getMontoRestante(monto: number) {
    let diferencia = this.metaMensual - monto;
    if (diferencia < 0)
      return 0;
    return diferencia;
  }
  cumpleMetaMes(monto: number) {
    return (monto >= this.metaMensual);
  }
  existeMes(mes: string) {
    if (this.documentosPorMes.length == 0)
      return false;
    for (let obj of this.documentosPorMes) {
      if (obj.mes == mes)
        return true;
    }
    return false;
  }


}
