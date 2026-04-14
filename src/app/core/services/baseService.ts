import { Injectable } from '@angular/core';
import {SocioNegocioItem, ParticipantePuntosMsg} from '../msg/socioNegocioMsg'
import { UrlServices } from '../global';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable()
export class BaseService {
    public http: HttpClient;
    constructor() {
    }
}
