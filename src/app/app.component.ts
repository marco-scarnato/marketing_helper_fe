import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { HealthResponse, HealthService } from './core/services/health.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
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
        this.error = 'Backend unreachable';
        this.loading = false;
      }
    });
  }
}
