import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GetUrlEndpointService } from '../../../core/services/get-url-endpoint.service';
import { Observable } from 'rxjs';
import { UserActionResponse } from './unlock-user.model';

@Injectable({
  providedIn: 'root',
})
export class UnlockUserServices {
  //DI
  private readonly http = inject(HttpClient);
  private readonly getUrlEndpointService = inject(GetUrlEndpointService);

  lockUser(userCode: string): Observable<UserActionResponse> {
    const url = this.getUrlEndpointService.service_layer + 'Users/lock';
    return this.http.patch<UserActionResponse>(url, { UserCode: userCode });
  }

  unlockUser(userCode: string): Observable<UserActionResponse> {
    const url = this.getUrlEndpointService.service_layer + 'Users/unlock';
    return this.http.patch<UserActionResponse>(url, { UserCode: userCode });
  }
}
