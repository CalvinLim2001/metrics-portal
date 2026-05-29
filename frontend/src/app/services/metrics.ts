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

  getMetrics(): Observable<any> {
  return new Observable(observer => {
    const ws = new WebSocket('ws://localhost:3000');
    
    ws.onmessage = (event) => {
      observer.next(JSON.parse(event.data));
    };

    ws.onerror = (error) => {
      observer.error(error);
    };

    ws.onclose = () => {
      observer.complete();
    };

    return () => {
      ws.close();
    };
  });
  }
}