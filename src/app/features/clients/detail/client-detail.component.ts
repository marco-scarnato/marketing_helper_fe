import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { environment } from '../../../../environments/environment';
import { Client } from '../../../core/models/client.model';
import { ClientService } from '../../../core/services/client.service';
import { ArchiveConfirmDialogComponent } from '../shared/archive-confirm-dialog.component';

@Component({
  selector: 'app-client-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatListModule,
    MatDialogModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './client-detail.component.html',
  styleUrl: './client-detail.component.scss'
})
export class ClientDetailComponent implements OnInit {
  client: Client | null = null;
  loading = true;
  archiving = false;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly clientService: ClientService,
    private readonly dialog: MatDialog,
    private readonly snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    const clientId = this.route.snapshot.paramMap.get('id');
    if (!clientId) {
      this.router.navigate(['/clients']);
      return;
    }

    this.loadClient(clientId);
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

  initials(name: string): string {
    return name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join('');
  }

  archiveClient(): void {
    if (!this.client || this.client.status !== 'active' || this.archiving) {
      return;
    }

    const dialogRef = this.dialog.open(ArchiveConfirmDialogComponent, {
      width: '420px',
      data: { clientName: this.client.name },
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (!confirmed || !this.client) {
        return;
      }

      this.archiving = true;
      this.clientService.archiveClient(this.client.id).subscribe({
        next: () => {
          this.snackBar.open('Cliente archiviato', 'Ok', { duration: 2500 });
          this.archiving = false;
          this.router.navigate(['/clients']);
        },
        error: () => {
          this.archiving = false;
          this.snackBar.open('Errore durante l\'archiviazione', 'Chiudi', { duration: 3000 });
        }
      });
    });
  }

  private loadClient(clientId: string): void {
    this.loading = true;

    this.clientService.getClient(clientId).subscribe({
      next: (client) => {
        this.client = client;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.snackBar.open('Cliente non trovato', 'Chiudi', { duration: 2500 });
        this.router.navigate(['/clients']);
      }
    });
  }
}
