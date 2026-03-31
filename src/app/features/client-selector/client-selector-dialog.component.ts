import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { combineLatest, map, startWith } from 'rxjs';

import { Client } from '../../core/models/client.model';
import { ActiveClientService } from '../../core/services/active-client.service';
import { ClientService } from '../../core/services/client.service';

export interface ClientSelectorDialogData {
  firstLoad: boolean;
}

@Component({
  selector: 'app-client-selector-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatListModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './client-selector-dialog.component.html',
  styleUrl: './client-selector-dialog.component.scss'
})
export class ClientSelectorDialogComponent implements OnInit {
  loading = true;
  clients: Client[] = [];
  filteredClients: Client[] = [];
  selectedClientId: string | null = null;
  searchControl = new FormControl('', { nonNullable: true });
  currentActiveClientId: string | null = null;

  constructor(
    private readonly clientService: ClientService,
    private readonly activeClientService: ActiveClientService,
    private readonly dialogRef: MatDialogRef<ClientSelectorDialogComponent>,
    private readonly router: Router,
    @Inject(MAT_DIALOG_DATA) public readonly data: ClientSelectorDialogData,
  ) {}

  ngOnInit(): void {
    this.activeClientService.activeClientId$.pipe(startWith(localStorage.getItem('active_client_id'))).subscribe((id) => {
      this.currentActiveClientId = id;
      if (!this.selectedClientId && id) {
        this.selectedClientId = id;
      }
    });

    this.clientService.getClients('active').subscribe({
      next: (clients) => {
        this.clients = clients;
        this.filteredClients = clients;
        this.loading = false;
      },
      error: () => {
        this.clients = [];
        this.filteredClients = [];
        this.loading = false;
      }
    });

    combineLatest([
      this.searchControl.valueChanges.pipe(startWith('')),
      this.activeClientService.activeClientId$.pipe(startWith(this.currentActiveClientId))
    ]).pipe(
      map(([search]) => String(search || '').toLowerCase().trim())
    ).subscribe((search) => {
      this.filteredClients = this.clients.filter((client) => {
        const target = `${client.name} ${client.sector || ''}`.toLowerCase();
        return target.includes(search);
      });
    });
  }

  pickClient(id: string): void {
    this.selectedClientId = id;
  }

  confirm(): void {
    if (!this.selectedClientId) {
      return;
    }

    this.activeClientService.setActiveClient(this.selectedClientId);
    this.dialogRef.close(true);
    this.router.navigate(['/workspace/dashboard']);
  }

  goToClientManagement(): void {
    this.dialogRef.close(false);
    this.router.navigate(['/clients']);
  }

  cancel(): void {
    this.dialogRef.close(false);
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p.charAt(0).toUpperCase())
      .join('');
  }
}
