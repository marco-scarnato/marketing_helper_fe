import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { environment } from '../../../../environments/environment';
import { Client, ClientCreate, ClientUpdate } from '../../../core/models/client.model';
import { ClientService } from '../../../core/services/client.service';

@Component({
  selector: 'app-client-form',
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
    MatSnackBarModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './client-form.component.html',
  styleUrl: './client-form.component.scss'
})
export class ClientFormComponent implements OnInit {
  form = this.fb.group({
    name: ['', Validators.required],
    sector: [''],
    website: [''],
    notes: [''],
    status: ['active', Validators.required],
    links: this.fb.array<FormGroup>([]),
    contacts: this.fb.array<FormGroup>([]),
  });

  loading = false;
  saving = false;
  isEditMode = false;
  clientId: string | null = null;
  selectedLogoFile: File | null = null;
  logoPreview: string | null = null;

  constructor(
    private readonly fb: FormBuilder,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly clientService: ClientService,
    private readonly snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.clientId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.clientId;

    if (this.isEditMode && this.clientId) {
      this.loadClient(this.clientId);
    } else {
      this.addLink();
      this.addContact();
    }
  }

  get linksArray(): FormArray<FormGroup> {
    return this.form.get('links') as FormArray<FormGroup>;
  }

  get contactsArray(): FormArray<FormGroup> {
    return this.form.get('contacts') as FormArray<FormGroup>;
  }

  addLink(): void {
    this.linksArray.push(
      this.fb.group({
        url: [''],
        label: [''],
      })
    );
  }

  removeLink(index: number): void {
    this.linksArray.removeAt(index);
  }

  addContact(): void {
    this.contactsArray.push(
      this.fb.group({
        name: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        role: [''],
      })
    );
  }

  removeContact(index: number): void {
    this.contactsArray.removeAt(index);
  }

  onLogoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      this.snackBar.open('Il logo supera il limite di 2MB', 'Chiudi', { duration: 3000 });
      input.value = '';
      return;
    }

    this.selectedLogoFile = file;

    const reader = new FileReader();
    reader.onload = () => {
      this.logoPreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = this.buildPayload();
    this.saving = true;

    if (this.isEditMode && this.clientId) {
      this.clientService.updateClient(this.clientId, payload as ClientUpdate).subscribe({
        next: (client) => this.afterClientSaved(client, 'Cliente aggiornato con successo'),
        error: (error) => this.onSaveError('Errore durante l\'aggiornamento del cliente', error),
      });
      return;
    }

    this.clientService.createClient(payload).subscribe({
      next: (client) => this.afterClientSaved(client, 'Cliente creato con successo'),
      error: (error) => this.onSaveError('Errore durante la creazione del cliente', error),
    });
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

  trackByIndex(index: number): number {
    return index;
  }

  private loadClient(id: string): void {
    this.loading = true;

    this.clientService.getClient(id).subscribe({
      next: (client) => {
        this.form.patchValue({
          name: client.name,
          sector: client.sector ?? '',
          website: client.website ?? '',
          notes: client.notes ?? '',
          status: client.status,
        });

        this.linksArray.clear();
        this.contactsArray.clear();

        if (client.links.length > 0) {
          client.links.forEach((link) => {
            this.linksArray.push(
              this.fb.group({
                url: [link.url],
                label: [link.label],
              })
            );
          });
        } else {
          this.addLink();
        }

        if (client.contacts.length > 0) {
          client.contacts.forEach((contact) => {
            this.contactsArray.push(
              this.fb.group({
                name: [contact.name, Validators.required],
                email: [contact.email, [Validators.required, Validators.email]],
                role: [contact.role ?? ''],
              })
            );
          });
        } else {
          this.addContact();
        }

        this.logoPreview = this.logoUrl(client.logo_path);
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.snackBar.open('Impossibile caricare il cliente', 'Chiudi', { duration: 3000 });
        this.router.navigate(['/clients']);
      }
    });
  }

  private buildPayload(): ClientCreate {
    const raw = this.form.getRawValue();
    const rawLinks = (raw.links ?? []) as Array<Record<string, unknown>>;
    const rawContacts = (raw.contacts ?? []) as Array<Record<string, unknown>>;

    const links = rawLinks
      .filter((link) => !!link['url'] && !!link['label'])
      .map((link) => ({
        url: this.normalizeUrl(String(link['url']).trim()),
        label: String(link['label']).trim(),
      }));

    const contacts = rawContacts
      .filter((contact) => !!contact['name'] && !!contact['email'])
      .map((contact) => ({
        name: String(contact['name']).trim(),
        email: String(contact['email']).trim(),
        role: contact['role'] ? String(contact['role']).trim() : undefined,
      }));

    return {
      name: String(raw.name).trim(),
      sector: raw.sector ? String(raw.sector).trim() : undefined,
      website: raw.website ? this.normalizeUrl(String(raw.website).trim()) : undefined,
      notes: raw.notes ? String(raw.notes).trim() : undefined,
      status: (raw.status as 'active' | 'archived') ?? 'active',
      links,
      contacts,
    };
  }

  private normalizeUrl(value: string): string {
    if (!value) {
      return value;
    }

    if (value.startsWith('http://') || value.startsWith('https://')) {
      return value;
    }

    return `https://${value}`;
  }

  private afterClientSaved(client: Client, successMessage: string): void {
    this.snackBar.open(successMessage, 'Ok', { duration: 2500 });

    if (this.selectedLogoFile) {
      this.clientService.uploadLogo(client.id, this.selectedLogoFile).subscribe({
        next: () => {
          this.snackBar.open('Logo caricato con successo', 'Ok', { duration: 2500 });
          this.saving = false;
          this.router.navigate(['/clients', client.id]);
        },
        error: () => {
          this.saving = false;
          this.snackBar.open('Cliente salvato, ma upload logo fallito', 'Chiudi', { duration: 3000 });
          this.router.navigate(['/clients', client.id]);
        }
      });
      return;
    }

    this.saving = false;
    this.router.navigate(['/clients', client.id]);
  }

  private onSaveError(message: string, error?: unknown): void {
    this.saving = false;
    const details = this.extractApiErrorDetails(error);
    this.snackBar.open(details ? `${message}: ${details}` : message, 'Chiudi', { duration: 4500 });
  }

  private extractApiErrorDetails(error: unknown): string | null {
    if (!(error instanceof HttpErrorResponse) || !error.error) {
      return null;
    }

    if (typeof error.error.detail === 'string') {
      return error.error.detail;
    }

    if (Array.isArray(error.error.detail) && error.error.detail.length > 0) {
      return error.error.detail
        .map((entry: { loc?: unknown[]; msg?: string }) => {
          const field = Array.isArray(entry.loc) ? entry.loc.join('.') : 'campo';
          return `${field}: ${entry.msg ?? 'valore non valido'}`;
        })
        .join(' | ');
    }

    return null;
  }
}
