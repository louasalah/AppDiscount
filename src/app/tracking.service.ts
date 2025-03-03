import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { debounceTime, catchError, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class TrackingService {
  private url = 'http://localhost:8080/Api';
  private startTime: { [pageName: string]: number } = {}; // Temps de suivi

  constructor(private http: HttpClient) {}

  // Méthode pour vérifier si un produit a déjà été cliqué
  private hasProductBeenClicked(idproduct: number): boolean {
    return sessionStorage.getItem(`clicked_${idproduct}`) !== null;
  }

  // Méthode pour marquer un produit comme "cliqué" pour la session en cours
  private markProductAsClicked(idproduct: number): void {
    sessionStorage.setItem(`clicked_${idproduct}`, 'true');
  }

  getTrackingData(): Observable<any> {
    return this.http.get<any>(`${this.url}/trackingData`).pipe(
      catchError((error) => {
        console.error('Erreur lors de la récupération des données de suivi', error);
        return of([]); // Retourne un tableau vide en cas d'erreur
      })
    );
  }

  getClickCount(idproduct: number): Observable<number> {
    return this.http.get<number>(`${this.url}/clicks/${idproduct}`).pipe(
      catchError((error) => {
        console.error('Erreur lors de la récupération du nombre de clics', error);
        return of(0); // Si l'appel échoue, retourner 0
      })
    );
  }

  trackClick(idproduct: number): void {
    if (this.hasProductBeenClicked(idproduct)) {
      console.log(`Le produit ${idproduct} a déjà été cliqué pendant cette session.`);
      return;
    }

    this.getClickCount(idproduct).subscribe((currentClicks) => {
      const newClickCount = currentClicks + 1;

      // Envoyer le clic au backend pour incrémenter la valeur
      this.http.post(`${this.url}/clicks/${idproduct}`, {}).pipe(
        debounceTime(300),
        catchError((error) => {
          console.error('Erreur lors de l\'enregistrement du clic', error);
          return of(null);
        })
      ).subscribe(() => {
        // Marquer le produit comme cliqué pour la session en cours
        this.markProductAsClicked(idproduct);
        console.log(`Click enregistré pour produit ${idproduct}, total : ${newClickCount}`);
      });
    });
  }

  startTracking(pageName: string): void {
    this.startTime[pageName] = Date.now();
  }

  traceTimeSpent(pagename: string, idproduct: number): Observable<any> {
    const timespent = Math.floor((Date.now() - this.startTime[pagename]) / 1000);
    console.log('Temps passé :', timespent);

    if (timespent <= 0) {
      console.warn('Temps passé trop court, aucune requête envoyée.');
      return of(null);
    }

    return this.getClickCount(idproduct).pipe(
      debounceTime(300),
      catchError(this.handleError('traceTempsPasse')),
      switchMap((clicks) => {
        const data = {
          pagename: pagename,
          timespent: timespent,
          idproduct: idproduct,
          clicks: clicks,  // Utilisez directement la valeur des clics
        };
  
        return this.http.post(`${this.url}/tracking/${idproduct}`, data);
      })
    );
  }

  private handleError(operation = 'operation') {
    return (error: any): Observable<any> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(null);
    };
  }
}
