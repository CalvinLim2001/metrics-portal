import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Metrics {
  cpu: {
    currentLoad: number;
    severity: string;
  };

  memory: {
    totalGB: number;
    freeGB: number;
    usedGB: number;
    severity: string;
  };

  network: {
    downloadMBps: number;
    uploadMBps: number;
    downloadSeverity: string;
    uploadSeverity: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class MetricsService {
  constructor(private http: HttpClient) {}

  getMetrics(): Observable<Metrics> {
    return this.http.get<Metrics>('/api/metrics');
  }
}