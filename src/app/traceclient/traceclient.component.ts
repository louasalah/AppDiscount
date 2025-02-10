import { Component, OnDestroy, OnInit } from '@angular/core';
import { TrackingService } from '../tracking.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-traceclient',
  templateUrl: './traceclient.component.html',
  styleUrl: './traceclient.component.css'
})
export class TraceclientComponent implements OnInit , OnDestroy {
  private productId: number = 0; 
  private PageName: string = '';
  constructor(private trackserv: TrackingService, private router: Router,private activatedRoute: ActivatedRoute) {}
  ngOnInit(): void {
      this.activatedRoute.params.subscribe((params) => {
      this.productId = +params['productId'];
      this.PageName = this.router.url;
      this.trackserv.startTracking(this.PageName); 
    });}

   ngOnDestroy(): void {
  if (this.PageName) {
    this.trackserv.traceTimeSpent(this.PageName).subscribe((response) => {
      if (response) {
        console.log('Temps passé enregistré avec succès');
      } else {
        console.log('Erreur lors de l’enregistrement du temps');
      }
    });
  }
}


  trackProductClick(ProdId: number): void {
    this.trackserv.traceClick(ProdId).subscribe(response => {
      if (response) {
        console.log('suivi du clic est fait avec succès');
      } else {
        console.log('Erreur dans le suivi du clic');
      }
    });
  }

  
}

