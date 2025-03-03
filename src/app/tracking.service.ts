import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, of } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class TrackingService {
  private url = 'http://localhost:8080/Api';
  private clicks: { [idproduct: number]: number } = {}; // Stocker les clics par produit
  private startTime: { [pageName: string]: number } = {};   // Store start time for each page

  constructor(private http: HttpClient) {}
   // Méthode pour récupérer les données de tracage
   getTrackingData(): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/trackingData`);
  }

  getClickCount(idproduct: number): number {
    return this.clicks[idproduct] || 0; // Retourner le nombre de clics pour le produit
  }

  trackClick(idproduct: number): void {
    if (!this.clicks[idproduct]) {
      this.clicks[idproduct] = 0;
    }
    this.clicks[idproduct] += 1;
    console.log(`Click enregistré pour produit ${idproduct}, total :`, this.clicks[idproduct]);
  }
  

  // Start tracking time for a given page
  startTracking(pageName: string): void {
    this.startTime[pageName] = Date.now();  // Record the start time when the page is accessed
  }

  // Track time spent on the page and clicks (without separate traceClick method)
  traceTimeSpent(pagename: string, idproduct: number): Observable<any> {
    const timespent = Math.floor((Date.now() - this.startTime[pagename]) / 1000);
    console.log('Temps passé :', timespent);

    if (timespent <= 0) {
      console.warn('Temps passé trop court, aucune requête envoyée.');
      return of(null);
    }

    // Add the clicks to the data before sending to the server
    const data = {
      pagename: pagename,
      timespent: timespent,
      idproduct: idproduct,
      clicks: this.getClickCount(idproduct), // Récupérer les clics pour ce produit
    };

    return this.http.post(`${this.url}/tracking/${idproduct}`, data).pipe(
      debounceTime(300),
      catchError(this.handleError('traceTempsPasse')) // Error handling
    );
  }

  // Error handling for failed requests
  private handleError(operation = 'operation') {
    return (error: any): Observable<any> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(null);
    };
  }
}
