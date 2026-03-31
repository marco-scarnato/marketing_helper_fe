import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, shareReplay, switchMap, tap } from 'rxjs/operators';

import { Client } from '../models/client.model';
import { ClientService } from './client.service';

@Injectable({ providedIn: 'root' })
export class ActiveClientService {
  private readonly storageKey = 'active_client_id';
  private readonly cache = new Map<string, Client>();

  readonly activeClientId$ = new BehaviorSubject<string | null>(localStorage.getItem(this.storageKey));
  readonly activeClient$: Observable<Client | null> = this.activeClientId$.pipe(
    switchMap((id) => {
      if (!id) {
        return of(null);
      }

      const cached = this.cache.get(id);
      if (cached) {
        return of(cached);
      }

      return this.clientService.getClient(id).pipe(
        tap((client) => this.cache.set(id, client)),
        catchError(() => of(null)),
      );
    }),
    shareReplay(1),
  );

  constructor(private readonly clientService: ClientService) {}

  setActiveClient(id: string): void {
    localStorage.setItem(this.storageKey, id);
    this.activeClientId$.next(id);
  }

  clearActiveClient(): void {
    localStorage.removeItem(this.storageKey);
    this.activeClientId$.next(null);
  }
}
