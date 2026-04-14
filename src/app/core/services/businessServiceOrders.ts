import { HubConnection, HubConnectionBuilder, HubConnectionState  } from '@aspnet/signalr';

import {Observable, interval} from 'rxjs';
import { Injectable } from '@angular/core';
import {LogMsg} from 'src/app/msg/common.msg';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class BusinessServiceOrders {
    private hub: HubConnection;
    public logObs: Observable<LogMsg>;
    public isRunningObs: Observable<boolean>;
    private serviceHubUrl: string;
    private serviceOrdersUrl: string;
    public hubConnectedObs: Observable<void>;
    public todayLogObs: Observable<LogMsg[]>;
    private checkHubConnectioTimerObs: any;
    
    constructor(private http: HttpClient) {}

    public setServiceHubUrl(url: string) {
        this.serviceHubUrl = url;
        this.initHub();
    }
    initCheckConnectionHub() {
        // cada minuto verifica conexión con el hub
        this.checkHubConnectioTimerObs = interval(60 * 1000);
        this.checkHubConnectioTimerObs.subscribe(() => {
            if (this.hub) {
                console.log('Hub Connection status: ' + this.getHubConexionStatus());
                if (this.hub.state === HubConnectionState.Disconnected) {
                    console.log('Reestableciendo conexión con el hub...');
                    this.initHub();
                }
            }
        });
    }
    getHubConexionStatus() {
        switch (this.hub.state) {
            case HubConnectionState.Disconnected:
                return 'Desconectado';
            case HubConnectionState.Connected:
                return 'Conectado';
        }
        return 'No definido';
    }
    public setServiceOrderUrl(url: string) {
        this.serviceOrdersUrl = url;
    }
    private initHub() {
        this.hubConnectedObs = new Observable<void>(hubConnectedObs => {
            this.hub =  new HubConnectionBuilder().withUrl(this.serviceHubUrl).build();
            this.hub
            .start()
            .then(() => {
                hubConnectedObs.next();
                this.checkIsRunning();
                this.requestTodayLogs();
                console.log('Conexión al Hub iniciada');
                this.initCheckConnectionHub();
            })
            .catch(err => console.log('Error while establishing connection :( :' + err));

            this.logObs = new Observable<LogMsg>( obs => {
                this.hub.on('PushLog', (log: LogMsg) => obs.next(log));
            });
            // el servidor responde con el estado del servicio
            this.isRunningObs = new Observable<boolean>(obs => {
                this.hub.on('IsRunningResponse', (isRunning: boolean) => obs.next(isRunning));
            });
            // El servidor responde con los logs de hou
            this.todayLogObs = new Observable<LogMsg[]>(obs => {
                this.hub.on('ResponseTodayLogs', (logs: LogMsg[]) => obs.next(logs));
            });
        });
    }
    private requestTodayLogs() {
        console.log(this.serviceOrdersUrl + '/requestTodayLogs');
        this.http.get(this.serviceOrdersUrl + '/requestTodayLogs').subscribe();
    }
    // consulta al servidor si el servicio esta corriendo
    private checkIsRunning() {
        this.http.get(this.serviceOrdersUrl + '/checkIsRunning').subscribe();
    }
    public status(): Observable<any> {
        // la respusta va al log
        console.log(this.serviceOrdersUrl + '/status');
        return this.http.get(this.serviceOrdersUrl + '/status');
    }
    public start(): Observable<any> {
        return this.http.get(this.serviceOrdersUrl + '/start');
    }
    public stop(): Observable<any> {
        return this.http.get(this.serviceOrdersUrl + '/stop');
    }
}
