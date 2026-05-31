import { Component, OnInit, signal, ChangeDetectorRef, AfterViewInit, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MetricsService } from './services/metrics';
import { MatTableModule, MatTableDataSource  } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DestroyRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MetricsChart } from './components/metrics-chart/metrics-chart';

const severityOrder: Record<string, number> = {
  'info': 1,
  'warning': 2,
  'critical': 3
};
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatTableModule, MatSortModule, CommonModule, MetricsChart],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit, AfterViewInit {
  private destroyRef = inject(DestroyRef);
  @ViewChild(MatSort) sort!: MatSort;
  protected readonly title = signal('frontend');
  latestMetrics: any = null;
   selectedFilter = 'all';
   metricsData = new MatTableDataSource<any>([]);
   selectedCategory = '';
   isConnecting = true;
     ngAfterViewInit() {
    this.metricsData.sort = this.sort;

    this.metricsData.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'CpuColumn':
          return item.metrics.cpu.currentLoad;
        case 'CpuSeverityColumn':
          return severityOrder[item.metrics.cpu.severity] ?? 0;
          case 'MemoryTotalColumn':
          return item.metrics.memory.totalGB;
        case 'MemoryFreeColumn':
          return item.metrics.memory.freeGB;
        case 'MemoryUsedColumn':
          return item.metrics.memory.usedGB;
        case 'MemorySeverityColumn':
          return severityOrder[item.metrics.memory.severity] ?? 0;
        case 'NetworkColumn':
          return item.metrics.network.downloadMBps;
        case 'NetworkDownloadSeverityColumn':
          return severityOrder[item.metrics.network.downloadSeverity] ?? 0;
        case 'NetworkUploadColumn':
          return item.metrics.network.uploadMBps;
        case 'NetworkUploadSeverityColumn':
          return severityOrder[item.metrics.network.uploadSeverity] ?? 0;
        default:
          return 0;
      }
    };

    this.metricsData.filterPredicate = (data, filter) => {
      if (filter === 'all') {
        return true;
      }
      return data.metrics.cpu.severity === filter ||
             data.metrics.memory.severity === filter ||
             data.metrics.network.downloadSeverity === filter ||
             data.metrics.network.uploadSeverity === filter;
};

  }
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
    this.metricsService.getMetrics()
     .pipe(takeUntilDestroyed(this.destroyRef)).subscribe(data => {
      this.metricsData.data = [data];
      this.latestMetrics = data;
      this.cdr.detectChanges();
      this.isConnecting = false;
    });
  }

applyFilter(severity: string) {
  this.selectedFilter = severity;
  this.metricsData.filter = severity;
}

applyCategory(category: string) {
  this.selectedCategory = category;
  
  const base = ['IdColumn'];
  
  const cpu = ['CpuColumn', 'CpuSeverityColumn'];
  const memory = ['MemoryTotalColumn', 'MemoryFreeColumn', 'MemoryUsedColumn', 'MemorySeverityColumn'];
  const network = ['NetworkColumn', 'NetworkDownloadSeverityColumn', 'NetworkUploadColumn', 'NetworkUploadSeverityColumn'];

  switch(category) {
    case 'cpu':     this.displayedColumns = [...base, ...cpu]; break;
    case 'memory':  this.displayedColumns = [...base, ...memory]; break;
    case 'network': this.displayedColumns = [...base, ...network]; break;
    default:        this.displayedColumns = [...base, ...cpu, ...memory, ...network];
  }
}

}

