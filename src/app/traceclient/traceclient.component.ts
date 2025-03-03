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
      (data: any) => {
        // Vérifier si `data` n'est pas vide
        if (data && data.length > 0) {
          data.forEach((item: any) => {
            console.log(item.idproduct);
  
            // Vérifier si l'ID du produit est défini et valide
            if (item.idproduct) {
              this.trackserv.getLinksByProductId(item.idproduct).subscribe(
                (links) => {
                  // Fusionner les résultats : créer un objet combiné
                  // Vous pouvez personnaliser la structure ici selon vos besoins
                  const combinedData = links.map((link: any) => ({
                    ...item,        // Inclure toutes les propriétés de `item`
                    ...link,        // Ajouter les propriétés de `link`
                  }));
  
                  // Ajouter les données combinées dans le tableau de suivi
                  this.tracageTable = [...this.tracageTable, ...combinedData];
                  console.log('test', this.tracageTable);
                },
                (error) => {
                  console.error('Erreur lors de la récupération des liens de suivi:', error);
                }
              );
            } else {
              console.error('ID du produit invalide ou manquant');
            }
          });
        } else {
          console.error('Aucune donnée disponible');
        }
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
