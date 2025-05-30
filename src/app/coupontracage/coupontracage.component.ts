import { Component, OnInit } from '@angular/core';
import { CouponService } from '../coupon.service';

@Component({
  selector: 'app-coupontracage',
  templateUrl: './coupontracage.component.html',
  styleUrl: './coupontracage.component.css'
})
export class CoupontracageComponent implements OnInit {
  trackingLogs: any[] = [];
  selectedItems: boolean[] = [];
constructor(private couponService:CouponService ){}
  ngOnInit() {
    this.couponService.getTrackingLogs().subscribe(
      (data) => {
        this.trackingLogs = data;
        console.log('Logs récupérés :', this.trackingLogs);
      },
      (error) => {
        console.error('Erreur lors de la récupération des logs :', error);
      }
    );
  }

  markAsUsed(id: number) {
    this.couponService.updateStatus(id, 'used').subscribe(() => {
      this.trackingLogs = this.trackingLogs.map(log => log.id === id ? { ...log, status: 'used' } : log);
    });
  }
  
markSelectedAsUsed() {
  this.trackingLogs.forEach((log, index) => {
    if (this.selectedItems[index]) {
      this.markAsUsed(log.id);
    }
  });
  // Réinitialiser la sélection après l'action
  this.selectedItems = [];
}
  
}