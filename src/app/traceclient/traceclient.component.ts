import { Component, OnInit, OnDestroy } from '@angular/core';
import { TrackingService } from '../tracking.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of, Subject } from 'rxjs';
import { catchError, takeUntil, tap } from 'rxjs/operators';

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
    // Appel de la méthode loadTrackingData
    this.loadTrackingData();
  }

  loadTrackingData(): void {
    this.trackserv.getTrackingData().pipe(
      catchError(error => {
        console.error('Erreur lors de la récupération des données de tracage:', error);
        return of([]); // Retourne un tableau vide en cas d'erreur
      }),
      takeUntil(this.destroy$)
    ).subscribe(
      (data: any) => {
        console.log('Données reçues:', data); // Afficher les données reçues
        if (data && data.length > 0) {
          data.forEach((item: any) => {
            console.log(item.idproduct);
  
            if (item.idproduct) {
              this.trackserv.getLinksByProductId(item.idproduct).pipe(
                catchError(error => {
                  console.error('Erreur lors de la récupération des liens de suivi:', error);
                  return of([]); // Retourne un tableau vide en cas d'erreur
                }),
                takeUntil(this.destroy$)
              ).subscribe(
                (links) => {
                  console.log('Liens reçus:', links); // Afficher les liens reçus
                  const combinedData = links.map((link: any) => ({
                    ...item, 
                    ...link,
                    timespent: item.timespent || 0, // Ajouter timespent
                    clicks: item.clicks || 0, // Ajouter clicks
                  }));
  
                  // Ajouter les données combinées à la table
                  this.tracageTable = [...this.tracageTable, ...combinedData];
                  console.log('Données combinées:', this.tracageTable);
                }
              );
            } else {
              console.error('ID du produit invalide ou manquant');
            }
          });
        } else {
          console.error('Aucune donnée disponible');
        }
      }
    );
  }
  

  handleClick(): void {
    this.trackserv.trackClick(this.idproduct); // Enregistrer un clic sur le produit
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

    // Emettre les données après destruction si nécessaire
    this.destroy$.next();
    this.destroy$.complete();
  }
}
