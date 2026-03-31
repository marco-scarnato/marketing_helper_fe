import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

export interface ArchiveConfirmDialogData {
  clientName: string;
}

@Component({
  selector: 'app-archive-confirm-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  templateUrl: './archive-confirm-dialog.component.html',
  styleUrl: './archive-confirm-dialog.component.scss'
})
export class ArchiveConfirmDialogComponent {
  constructor(
    private readonly dialogRef: MatDialogRef<ArchiveConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public readonly data: ArchiveConfirmDialogData
  ) {}

  confirm(): void {
    this.dialogRef.close(true);
  }

  cancel(): void {
    this.dialogRef.close(false);
  }
}
