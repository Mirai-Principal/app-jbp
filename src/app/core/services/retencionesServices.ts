import { HubConnection, HubConnectionBuilder, HubConnectionState  } from '@aspnet/signalr';
import { Injectable } from '@angular/core';
import {Observable, interval, observable} from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { UrlServices } from '../global';
import {StatusMsg} from '../msg/common.msg';

@Injectable()
export class RetencionesServices {
    
    private hub: HubConnection;
    public hubConnectedObs: Observable<void>;
    public statusObs: Observable<StatusMsg>;

    constructor(private http: HttpClient) {
        this.initHub();
    }

    private initHub() {
        this.hubConnectedObs = new Observable<void>(hubConnectedObs => {
            this.hub =  new HubConnectionBuilder().withUrl(UrlServices.retencionesServiceHubUrl).build();
            this.hub
            .start()
            .then(() => {
                hubConnectedObs.next();
                this.requestMsg();
                console.log('Conexión al Hub iniciada');
            })
            .catch(err => console.log('Error while establishing connection :( :' + err));

            
            // Se dispara cuando se envia un mensaje de estado de la retención
            this.statusObs = new Observable<StatusMsg>(obs => {
                this.hub.on('SendMessage', (me: StatusMsg) =>{
                    obs.next(me);
                } );
            });
        });
    }
    private requestMsg() {
        console.log(UrlServices.retencionesServiceUrl);
        this.http.get(UrlServices.retencionesServiceUrl + '/requestMessage').subscribe();
    }
    enviarRetenciones(mesesRetencion) {
        const url = UrlServices.autorizacionesSRIServiceUrl + '/enviarRetenciones/'+mesesRetencion;
        console.log(url);
        return new Observable<void>(obs=>{
            this.http.get(url)
            .subscribe(
                data => {
                  console.log('success', data);
                  obs.next();
                },
                error => {
                  console.log('oops', error);
                  obs.next();
                }
              );
        });
    }
}