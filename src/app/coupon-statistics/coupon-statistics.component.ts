import { Component, OnInit } from '@angular/core';
import { CouponService } from '../coupon.service';

@Component({
  selector: 'app-coupon-statistics',
  templateUrl: './coupon-statistics.component.html',
  styleUrl: './coupon-statistics.component.css'
})
export class CouponStatisticsComponent implements OnInit {
  statistics: any = {};  // Pour stocker les statistiques récupérées

  constructor(private couponService:CouponService ) {}

  ngOnInit(): void {
    this.getCouponStatistics();
  }

  getCouponStatistics(): void {
    this.couponService.getCouponStatistics().subscribe(
      data => {
        this.statistics = data;  // Assignez les données récupérées à la variable statistics
      },
      error => {
        console.error('Erreur lors de la récupération des statistiques', error);
      }
    );
  }
}