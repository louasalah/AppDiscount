import { Component, OnInit, OnDestroy } from '@angular/core';
import { TrackingService } from '../tracking.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-traceclient',
  templateUrl: './traceclient.component.html',
  styleUrls: ['./traceclient.component.css']
})
export class TraceclientComponent implements OnInit, OnDestroy {
  private idproduct: number = 0;
  private pagename: string = '';
  private destroy$ = new Subject<void>();
  tracageTable: any[] = [];

  constructor(
    private trackserv: TrackingService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.idproduct = +this.route.snapshot.paramMap.get('idproduct')!;
    this.pagename = this.router.url;
  
    if (this.idproduct) {
      this.trackserv.startTracking(this.pagename);
      this.trackserv.trackClick(this.idproduct); // Enregistre le clic si pas encore cliqué dans la session
    }
    this.loadTrackingData();
  }
  
  loadTrackingData(): void {
    this.trackserv.getTrackingData().subscribe(
      (data) => {
        this.tracageTable = data;
      },
      (error) => {
        console.error('Erreur lors de la récupération des données de tracage:', error);
      }
    );
  }

  // Appeler cette méthode pour enregistrer un clic (par ex. bouton acheter)
  handleClick(): void {
    this.trackserv.trackClick(this.idproduct);
  }

  ngOnDestroy(): void {
    if (this.pagename && this.idproduct) {
      this.trackserv.traceTimeSpent(this.pagename, this.idproduct).pipe(
        takeUntil(this.destroy$)
      ).subscribe(response => {
        if (response) {
          console.log('Temps passé enregistré avec succès');
        } else {
          console.log('Erreur lors de l’enregistrement du temps');
        }
      });
    }
  }
}
