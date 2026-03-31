import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Subject, takeUntil } from 'rxjs';

import { BrandIdentity, BrandIdentityUpdate } from '../../../core/models/brand-identity.model';
import { ActiveClientService } from '../../../core/services/active-client.service';
import { BrandIdentityService } from '../../../core/services/brand-identity.service';
import { WorkspaceStateService } from '../../../core/services/workspace-state.service';
import { AIPanelComponent } from './ai-panel/ai-panel.component';
import { BrandIdentityFormComponent } from './brand-identity-form/brand-identity-form.component';

@Component({
  selector: 'app-brand-identity-page',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    AIPanelComponent,
    BrandIdentityFormComponent,
  ],
  templateUrl: './brand-identity-page.component.html',
  styleUrl: './brand-identity-page.component.scss'
})
export class BrandIdentityPageComponent implements OnInit, OnDestroy {
  clientId: string | null = null;
  brandIdentity: BrandIdentity | null = null;

  loading = true;
  initialized = false;
  activeSection: string | null = null;

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly activeClientService: ActiveClientService,
    private readonly brandIdentityService: BrandIdentityService,
    private readonly workspaceStateService: WorkspaceStateService,
    private readonly snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.activeClientService.activeClient$
      .pipe(takeUntil(this.destroy$))
      .subscribe((client) => {
        this.clientId = client?.id ?? null;
        this.initialized = false;
        this.brandIdentity = null;

        if (!this.clientId) {
          this.loading = false;
          return;
        }

        this.loadBrandIdentity(this.clientId);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onFormDirty(dirty: boolean): void {
    this.workspaceStateService.setDirty(dirty);
  }

  onSectionFocused(section: string): void {
    this.activeSection = section;
  }

  onSaveSection(event: { section: string; payload: BrandIdentityUpdate }): void {
    if (!this.clientId) {
      return;
    }

    const payload: BrandIdentityUpdate = {
      ...event.payload,
      client_id: this.clientId,
    };

    const operation = this.brandIdentity
      ? this.brandIdentityService.update(this.clientId, payload)
      : this.brandIdentityService.create(payload as BrandIdentityUpdate & { client_id: string });

    operation.subscribe({
      next: (result) => {
        this.brandIdentity = result;
        this.initialized = true;
        this.workspaceStateService.setDirty(false);
        this.snackBar.open('Sezione salvata con successo', 'Chiudi', { duration: 2500 });
      },
      error: () => {
        this.snackBar.open('Errore durante il salvataggio della sezione', 'Chiudi', { duration: 3000 });
      }
    });
  }

  onUploadLogo(file: File): void {
    if (!this.clientId) {
      return;
    }

    this.brandIdentityService.uploadLogoAsset(this.clientId, file, 'icon').subscribe({
      next: (identity) => {
        this.brandIdentity = identity;
        this.snackBar.open('Logo caricato con successo', 'Chiudi', { duration: 2500 });
      },
      error: () => {
        this.snackBar.open('Upload logo fallito', 'Chiudi', { duration: 3000 });
      }
    });
  }

  onApplyAI(event: { section: string; proposed: Record<string, any> }): void {
    if (!this.clientId) {
      return;
    }

    const payload: BrandIdentityUpdate = {
      ...event.proposed,
      client_id: this.clientId,
    };

    const operation = this.brandIdentity
      ? this.brandIdentityService.update(this.clientId, payload)
      : this.brandIdentityService.create(payload as BrandIdentityUpdate & { client_id: string });

    operation.subscribe({
      next: (result) => {
        this.brandIdentity = result;
        this.initialized = true;
        this.workspaceStateService.setDirty(false);
        this.snackBar.open('Proposta AI applicata', 'Chiudi', { duration: 2500 });
      },
      error: () => {
        this.snackBar.open('Errore applicando la proposta AI', 'Chiudi', { duration: 3000 });
      }
    });
  }

  startManualFlow(): void {
    this.initialized = true;
    this.activeSection = 'core';
  }

  startAIFlow(): void {
    this.initialized = true;
    this.activeSection = 'full-brand';
  }

  private loadBrandIdentity(clientId: string): void {
    this.loading = true;
    this.brandIdentityService.getByClient(clientId).subscribe({
      next: (identity) => {
        this.brandIdentity = identity;
        this.initialized = true;
        this.loading = false;
      },
      error: () => {
        this.brandIdentity = null;
        this.initialized = false;
        this.loading = false;
      }
    });
  }
}
