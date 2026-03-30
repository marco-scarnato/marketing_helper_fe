import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

export interface HealthResponse {
  status: string;
  service: string;
  environment: string;
}

@Injectable({
  providedIn: 'root'
})
export class HealthService {
  private readonly healthUrl = `${environment.apiUrl}/api/health`;

  constructor(private readonly http: HttpClient) {}

  getHealth(): Observable<HealthResponse> {
    return this.http.get<HealthResponse>(this.healthUrl);
  }
}
