import { Component, OnInit, OnDestroy } from '@angular/core';
import { TrackingService } from '../tracking.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of, Subject } from 'rxjs';
import { catchError, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-traceclient',
  templateUrl: './traceclient.component.html',
  styleUrls: ['./traceclient.component.css']
})
export class TraceclientComponent implements OnInit, OnDestroy {
  private idproduct: number = 0;
  private pagename: string = '';
  private destroy$ = new Subject<void>();
  private trackingInterval: any;
  tracageTable: any[] = [];

  constructor(
    private trackserv: TrackingService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('idproduct');
    if (!idParam) {
      console.error('No product ID provided');
      return;
    }

    this.idproduct = +idParam;
    this.pagename = this.router.url;
    console.log('Product ID:', this.idproduct);

    // Start tracking
    this.trackserv.startTracking(this.pagename);
    this.trackserv.trackClick(this.idproduct).subscribe();
    
    // Load initial tracking data
    this.loadTrackingData();

    // Set up periodic tracking
    this.trackingInterval = setInterval(() => {
      this.trackserv.traceTimeSpent(this.pagename, this.idproduct).subscribe();
    }, 5000);
  }
  loadTrackingData(): void {
    this.trackserv.getTrackingLinKData().pipe(
      catchError(error => {
        console.error('Error fetching tracking data:', error);
        return of([]); // Renvoi d'un tableau vide en cas d'erreur
      }),
      takeUntil(this.destroy$)
    ).subscribe(data => {
      console.log('Received tracking data:', data);
      
      if (Array.isArray(data) && data.length > 0) {
        this.tracageTable = data; // Mise à jour de tracageTable avec les données reçues
      } else {
        console.log('No tracking data available');
      }
    });
  }
    

  ngOnDestroy(): void {
    // Clear tracking interval
    if (this.trackingInterval) {
      clearInterval(this.trackingInterval);
    }

    // Send final time tracking
    this.trackserv.traceTimeSpent(this.pagename, this.idproduct).subscribe();
    
    // Clean up subscriptions
    this.destroy$.next();
    this.destroy$.complete();
  }
}