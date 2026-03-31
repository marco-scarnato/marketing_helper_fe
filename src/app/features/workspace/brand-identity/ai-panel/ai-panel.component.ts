import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { AIBrandPromptResponse } from '../../../../core/models/brand-identity.model';
import { BrandIdentityService } from '../../../../core/services/brand-identity.service';

@Component({
  selector: 'app-ai-panel',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
  ],
  templateUrl: './ai-panel.component.html',
  styleUrl: './ai-panel.component.scss'
})
export class AIPanelComponent {
  @Input() activeSection: string | null = null;
  @Input() clientId = '';
  @Output() applyProposal = new EventEmitter<{ section: string; proposed: Record<string, any> }>();

  promptControl = new FormControl('', { nonNullable: true, validators: [Validators.required] });
  loading = false;
  response: AIBrandPromptResponse | null = null;

  constructor(
    private readonly brandIdentityService: BrandIdentityService,
    private readonly snackBar: MatSnackBar,
  ) {}

  generate(): void {
    if (!this.activeSection || !this.clientId || this.promptControl.invalid) {
      return;
    }

    this.loading = true;
    this.response = null;
    this.brandIdentityService.aiGenerate({
      client_id: this.clientId,
      prompt: this.promptControl.value,
      section: this.activeSection,
    }).subscribe({
      next: (response) => {
        this.response = response;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.snackBar.open('Errore durante la generazione AI', 'Chiudi', { duration: 3000 });
      }
    });
  }

  apply(): void {
    if (!this.response || !this.activeSection) {
      return;
    }

    this.applyProposal.emit({
      section: this.activeSection,
      proposed: this.response.proposed,
    });
  }

  get hasProposedData(): boolean {
    return !!this.response && Object.keys(this.response.proposed || {}).length > 0;
  }
}
