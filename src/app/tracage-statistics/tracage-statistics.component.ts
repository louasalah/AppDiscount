import { Component, OnInit } from '@angular/core';
import { TrackingService } from '../tracking.service';

@Component({
  selector: 'app-tracage-statistics',
  templateUrl: './tracage-statistics.component.html',
  styleUrls: ['./tracage-statistics.component.css']
})
export class TracageStatisticsComponent implements OnInit {
  statistics: any = {};

  constructor(private trackserv: TrackingService) {}

  ngOnInit(): void {
    this.trackserv.getAdvancedTrackingStatistics().subscribe(data => {
      this.statistics = data;
      console.log("test", this.statistics);
    });
  }

  getProductReference(productId: number): string {
    if (!this.statistics.productDetails) {
      return 'Référence inconnue';
    }
    
    const product = this.statistics.productDetails.find((p: any) => p.idproduct === productId);
    return product ? product.referenceProduct : 'Référence inconnue';
  }
}
