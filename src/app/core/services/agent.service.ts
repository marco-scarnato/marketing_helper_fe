import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { AgentInvokeRequest, AgentInvokeResponse } from '../models/agent.model';

@Injectable({ providedIn: 'root' })
export class AgentService {
  private readonly baseUrl = `${environment.apiUrl}/api/agent`;

  constructor(private readonly http: HttpClient) {}

  invoke(payload: AgentInvokeRequest): Observable<AgentInvokeResponse> {
    return this.http.post<AgentInvokeResponse>(`${this.baseUrl}/invoke`, payload);
  }
}
