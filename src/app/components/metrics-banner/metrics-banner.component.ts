import { Component, OnInit, Input } from '@angular/core';
import { Metric } from '../../models/Metric';

@Component({
  selector: 'app-metrics-banner',
  templateUrl: './metrics-banner.component.html',
  styleUrls: ['./metrics-banner.component.css']
})
export class MetricsBannerComponent implements OnInit {
  @Input() metrics: Metric;

  constructor() { }

  ngOnInit() {
  }

}
