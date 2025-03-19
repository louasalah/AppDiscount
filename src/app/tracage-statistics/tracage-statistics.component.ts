import { Component, OnInit } from '@angular/core';
import { TrackingService } from '../tracking.service';

@Component({
  selector: 'app-tracage-statistics',
  templateUrl: './tracage-statistics.component.html',
  styleUrl: './tracage-statistics.component.css'
})
export class TracageStatisticsComponent implements OnInit {
  statistics: any = {};

  constructor( private trackserv: TrackingService) {}

  ngOnInit(): void {
    this.trackserv.getAdvancedTrackingStatistics().subscribe(data => {
      this.statistics = data;
    });
  }
}


