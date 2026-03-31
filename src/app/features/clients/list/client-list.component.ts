import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleChange, MatSlideToggleModule } from '@angular/material/slide-toggle';
import { RouterModule } from '@angular/router';
import { debounceTime, distinctUntilChanged } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { Client, ContactItem, ClientStatus } from '../../../core/models/client.model';
import { ClientService } from '../../../core/services/client.service';

@Component({
  selector: 'app-client-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatChipsModule,
    MatSlideToggleModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './client-list.component.html',
  styleUrl: './client-list.component.scss'
})
export class ClientListComponent implements OnInit {
  clients: Client[] = [];
  loading = true;
  error: string | null = null;
  showArchived = false;
  searchControl = new FormControl('', { nonNullable: true });

  constructor(private readonly clientService: ClientService) {}

  ngOnInit(): void {
    this.loadClients();

    this.searchControl.valueChanges.pipe(debounceTime(300), distinctUntilChanged()).subscribe(() => {
      this.loadClients();
    });
  }

  onArchivedToggle(event: MatSlideToggleChange): void {
    this.showArchived = event.checked;
    this.loadClients();
  }

  getFirstContact(client: Client): ContactItem | null {
    return client.contacts.length > 0 ? client.contacts[0] : null;
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join('');
  }

  logoUrl(path?: string): string | null {
    if (!path) {
      return null;
    }

    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }

    return `${environment.apiUrl}${path}`;
  }

  private loadClients(): void {
    this.loading = true;
    this.error = null;

    const status: ClientStatus = this.showArchived ? 'archived' : 'active';
    this.clientService.getClients(status, this.searchControl.value).subscribe({
      next: (clients) => {
        this.clients = clients;
        this.loading = false;
      },
      error: () => {
        this.error = 'Errore durante il caricamento clienti';
        this.loading = false;
      }
    });
  }
}
