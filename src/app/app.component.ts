import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';

import { Client } from './core/models/client.model';
import { ActiveClientService } from './core/services/active-client.service';
import { WorkspaceStateService } from './core/services/workspace-state.service';
import { ClientSelectorDialogComponent } from './features/client-selector/client-selector-dialog.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatCardModule,
    MatDialogModule,
    MatTooltipModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  readonly activeClient$: Observable<Client | null>;
  readonly isDirty$: Observable<boolean>;
  hasActiveClient = false;
  private dialogOpen = false;

  constructor(
    private readonly activeClientService: ActiveClientService,
    private readonly workspaceStateService: WorkspaceStateService,
    private readonly dialog: MatDialog,
    private readonly router: Router,
  ) {
    this.activeClient$ = this.activeClientService.activeClient$;
    this.isDirty$ = this.workspaceStateService.isDirty$;
  }

  ngOnInit(): void {
    this.activeClientService.activeClientId$.subscribe((id) => {
      this.hasActiveClient = !!id;

      if (!id) {
        this.openClientSelector(true);
        return;
      }

      if (this.router.url === '/') {
        this.router.navigate(['/workspace/dashboard']);
      }
    });
  }

  openClientSelector(firstLoad = false): void {
    if (this.dialogOpen) {
      return;
    }

    this.dialogOpen = true;
    const ref = this.dialog.open(ClientSelectorDialogComponent, {
      width: '680px',
      disableClose: firstLoad,
      data: { firstLoad },
    });
    ref.afterClosed().subscribe(() => {
      this.dialogOpen = false;
    });
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
