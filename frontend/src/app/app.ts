import { Component, OnInit, signal, ChangeDetectorRef } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MetricsService } from './services/metrics';
import { MatTableModule } from '@angular/material/table';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatTableModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('frontend');

  metricsData: any[] = [];
  
  displayedColumns = [
    'IdColumn',
    'CpuColumn',
    'CpuSeverityColumn',
    'MemoryTotalColumn',
    'MemoryFreeColumn',
    'MemoryUsedColumn',
    'MemorySeverityColumn',
    'NetworkColumn',
    'NetworkDownloadSeverityColumn',
    'NetworkUploadColumn',
    'NetworkUploadSeverityColumn'
  ];

  constructor(private metricsService: MetricsService,
              private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.metricsService.getMetrics().subscribe(data => {
      this.metricsData = [data];
            this.cdr.detectChanges();
    });
  }
}

