import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { debounceTime, catchError, switchMap, tap } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class TrackingService {
  private url = 'http://localhost:8080/Api';
  private startTime: { [pageName: string]: number } = {}; // Temps de suivi
  isTrackingSent: any;

  constructor( private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
) {}

private hasProductBeenClicked(idproduct: number): boolean {
  if (isPlatformBrowser(this.platformId)) {
    return sessionStorage.getItem(`clicked_${idproduct}`) !== null;
  }
  return false;
}

private markProductAsClicked(idproduct: number): void {
  if (isPlatformBrowser(this.platformId)) {
    sessionStorage.setItem(`clicked_${idproduct}`, 'true');
  }
}
  getTrackingData(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:8080/Api/trackingData').pipe(
      catchError((error) => {
        console.error('Erreur lors de la récupération des données de suivi', error);
        return of([]); // Retourne un tableau vide en cas d'erreur
      })
    );
  }
  
  getTrackingLinKData(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:8080/Api/all').pipe(
      catchError((error) => {
        console.error('Erreur lors de la récupération des données de suivi', error);
        return of([]); // Retourne un tableau vide en cas d'erreur
      })
    );
  }

  getLinksByProductId(idproduct: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/links/${idproduct}`).pipe(
      catchError((error) => {
        console.error('Erreur lors de la récupération des liens de suivi', error);
        return of([]); // Retourne une liste vide en cas d'erreur
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

  trackClick(idproduct: number): Observable<any> {
    if (this.hasProductBeenClicked(idproduct)) {
      console.log(`Le produit ${idproduct} a déjà été cliqué pendant cette session.`);
      return of(null);
    }
  
    return this.http.post(`${this.url}/tracking/${idproduct}`, {}).pipe(
      tap(() => {
        this.markProductAsClicked(idproduct); // Marquer comme cliqué une fois le clic enregistré
        console.log(`Clic enregistré pour le produit ${idproduct}`);
      }),
      catchError((error) => {
        console.error('Erreur lors de l\'enregistrement du clic', error);
        return of(null);
      })
    );
  }
  
  
  
  startTracking(pageName: string): void {
    this.startTime[pageName] = Date.now();
  }

  traceTimeSpent(pagename: string, idproduct: number): Observable<any> {
    const start = this.startTime[pagename];
    if (!start) {
      console.warn('Le suivi du temps n\'a pas été initialisé pour cette page');
      return of(null);
    }
  
    const timespent = Math.floor((Date.now() - start) / 1000);
    console.log('Temps passé :', timespent);
  
    if (timespent <= 1) { // Ignore si < 5 secondes
      console.warn('Temps passé trop court, aucune requête envoyée.');
      return of(null);
    }
  
    const data = { pagename, timespent, idproduct };
  
    return this.http.post(`${this.url}/tracking/${idproduct}`, data).pipe(
      catchError(this.handleError('traceTempsPasse'))
    );
  }
  
  
  
  private handleError(operation = 'operation') {
    return (error: any): Observable<any> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(null);
    };
  }
  trackUserLocation(idproduct: number, trackingData: any): Observable<any> {
    console.log('Tracking data sent for session:',idproduct)
    return this.http.post(`${this.url}/tracking/${idproduct}/${trackingData.sessionId}`, trackingData).pipe(
      tap(() => console.log('Tracking data sent for session:', trackingData.sessionId)),
      catchError((error) => {
        console.error('Error sending tracking data:', error);
        return of(null);
      })
    );
  }


  //statistique 
  getAdvancedTrackingStatistics(): Observable<any> {
    return this.http.get(`${this.url}/advanced-statistics`);
  }
  
  
}
