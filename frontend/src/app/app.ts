import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MetricsService } from './services/metrics';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('frontend');

  constructor(private metricsService: MetricsService) {}

  ngOnInit() {
    this.metricsService.getMetrics().subscribe(data => {
      console.log(data);
    });
  }
}