import { Component, Input, OnChanges, ViewChild } from '@angular/core';
import { ChartConfiguration  } from "chart.js";
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-metrics-chart',
  imports: [BaseChartDirective],
  templateUrl: './metrics-chart.html',
  styleUrl: './metrics-chart.css', 
}) 
export class MetricsChart implements OnChanges {
  @Input() latestMetrics: any = null;
@ViewChild('cpuChart', { read: BaseChartDirective }) cpuChart?: BaseChartDirective;
@ViewChild('memoryChart', { read: BaseChartDirective }) memoryChart?: BaseChartDirective;
@ViewChild('networkChart', { read: BaseChartDirective }) networkChart?: BaseChartDirective;


    cpuData: ChartConfiguration['data'] = {
    labels: new Array(30).fill(''),
    datasets: [{
      data: new Array(30).fill(0),
      label: 'CPU %',
      fill: true
    }],
  };

cpuOptions: ChartConfiguration['options'] = {
  scales: {
    y: {
      min: 0,
      max: 100,
      ticks: {
        stepSize: 10
      }
    }
  },
  plugins: {
    title: {
      display: true,
      text: 'CPU Usage Over Time'
    }
  }
};

memoryData: ChartConfiguration['data'] = {
  labels: new Array(30).fill(''),
  datasets: [{
    data: new Array(30).fill(0),
    label: 'Memory Used GB',
    fill: true
  }],
};

memoryOptions: ChartConfiguration['options'] = {
  scales: {
    y: {
      min: 0,
      max: 16,
      ticks: {
        stepSize: 2
      }
    }
  },
  plugins: {
    title: {
      display: true,
      text: 'Memory Usage Over Time'
    }
  }
};

networkData: ChartConfiguration['data'] = {
  labels: new Array(30).fill(''),
  datasets: [
    {
      data: new Array(30).fill(0),
      label: 'Download MB/s',
      fill: true
    },
    {
      data: new Array(30).fill(0),
      label: 'Upload MB/s',
      fill: true
    }
  ]
};

networkOptions: ChartConfiguration['options'] = {
  scales: {
    y: {
      min: 0,
      ticks: {
        stepSize: 1
      }
    }
  },
  plugins: {
    title: {
      display: true,
      text: 'Network Usage Over Time'
    }
  }
};

ngOnChanges() {
  if (!this.latestMetrics) return;

  let totalMemory = this.latestMetrics.metrics.memory.totalGB;


  try {
    const cpuValue = this.latestMetrics.metrics.cpu.currentLoad;
    const memoryValue = this.latestMetrics.metrics.memory.usedGB;
    const downloadValue = this.latestMetrics.metrics.network.downloadMBps;
const uploadValue = this.latestMetrics.metrics.network.uploadMBps;

    this.cpuData.datasets[0].data.push(cpuValue);
    this.cpuData.datasets[0].data.shift();
    this.memoryData.datasets[0].data.push(memoryValue);
    this.memoryData.datasets[0].data.shift();
    this.networkData.datasets[0].data.push(downloadValue);
    this.networkData.datasets[0].data.shift();
    this.networkData.datasets[1].data.push(uploadValue);
    this.networkData.datasets[1].data.shift();
if (this.memoryOptions?.scales?.['y']) {
  this.memoryOptions = {
    ...this.memoryOptions,
    scales: {
      y: {
        min: 0,
        max: totalMemory,
        ticks: {
          stepSize: 2
        }
      }
    }
  };
}
console.log('totalGB:', this.latestMetrics.metrics.memory.totalGB);
    this.cpuChart?.update();
    this.memoryChart?.update();
    this.networkChart?.update();
  } catch (err) {
    console.error('Chart update error:', err);
  }
}
}
