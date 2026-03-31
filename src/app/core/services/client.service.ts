import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Client, ClientCreate, ClientUpdate, ClientStatus } from '../models/client.model';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private readonly baseUrl = `${environment.apiUrl}/api/clients`;

  constructor(private readonly http: HttpClient) {}

  getClients(status: ClientStatus = 'active', search = ''): Observable<Client[]> {
    let params = new HttpParams().set('status', status);
    const cleanSearch = search.trim();
    if (cleanSearch) {
      params = params.set('search', cleanSearch);
    }

    return this.http.get<Client[]>(this.baseUrl, { params });
  }

  getClient(id: string): Observable<Client> {
    return this.http.get<Client>(`${this.baseUrl}/${id}`);
  }

  createClient(data: ClientCreate): Observable<Client> {
    return this.http.post<Client>(this.baseUrl, data);
  }

  updateClient(id: string, data: ClientUpdate): Observable<Client> {
    return this.http.patch<Client>(`${this.baseUrl}/${id}`, data);
  }

  archiveClient(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  uploadLogo(id: string, file: File): Observable<{ logo_path: string }> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<{ logo_path: string }>(`${this.baseUrl}/${id}/logo`, formData);
  }
}
