import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { HealthResponse, HealthService } from '../../core/services/health.service';

@Component({
  selector: 'app-health-home',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatProgressSpinnerModule],
  templateUrl: './health-home.component.html',
  styleUrl: './health-home.component.scss'
})
export class HealthHomeComponent implements OnInit {
  healthResponse: HealthResponse | null = null;
  status = '';
  environment = '';
  loading = true;
  error: string | null = null;

  constructor(private readonly healthService: HealthService) {}

  ngOnInit(): void {
    this.healthService.getHealth().subscribe({
      next: (response: HealthResponse) => {
        this.healthResponse = response;
        this.status = response?.status ?? 'unknown';
        this.environment = response?.environment ?? 'unknown';
        this.loading = false;
      },
      error: () => {
        this.error = 'Backend non raggiungibile';
        this.loading = false;
      }
    });
  }
}
