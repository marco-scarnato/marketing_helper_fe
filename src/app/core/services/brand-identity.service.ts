import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { AIBrandPromptRequest, AIBrandPromptResponse, BrandIdentity, BrandIdentityUpdate } from '../models/brand-identity.model';

@Injectable({ providedIn: 'root' })
export class BrandIdentityService {
  private readonly baseUrl = `${environment.apiUrl}/api/clients`;

  constructor(private readonly http: HttpClient) {}

  getByClient(clientId: string): Observable<BrandIdentity> {
    return this.http.get<BrandIdentity>(`${this.baseUrl}/${clientId}/brand-identity`);
  }

  create(data: BrandIdentityUpdate & { client_id: string }): Observable<BrandIdentity> {
    const clientId = data.client_id;
    return this.http.post<BrandIdentity>(`${this.baseUrl}/${clientId}/brand-identity`, data);
  }

  update(clientId: string, data: BrandIdentityUpdate): Observable<BrandIdentity> {
    return this.http.patch<BrandIdentity>(`${this.baseUrl}/${clientId}/brand-identity`, data);
  }

  uploadLogoAsset(clientId: string, file: File, variant = 'icon'): Observable<BrandIdentity> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('variant', variant);
    return this.http.post<BrandIdentity>(`${this.baseUrl}/${clientId}/brand-identity/logos`, formData);
  }

  aiGenerate(req: AIBrandPromptRequest): Observable<AIBrandPromptResponse> {
    return this.http.post<AIBrandPromptResponse>(`${this.baseUrl}/${req.client_id}/brand-identity/ai-generate`, req);
  }
}
