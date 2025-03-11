// tracking.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class TrackingService {
  private url = 'http://localhost:8080/Api';

  constructor(private http: HttpClient) {}

  getTrackingData(): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/trackingData`).pipe(
      catchError((error) => {
        console.error('Error fetching tracking data', error);
        return of([]);
      })
    );
  }

  getLinksByProductId(idproduct: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/links/${idproduct}`).pipe(
      catchError((error) => {
        console.error('Error fetching tracking links', error);
        return of([]);
      })
    );
  }

  getClickCount(idproduct: number): Observable<number> {
    return this.http.get<number>(`${this.url}/clicks/${idproduct}`).pipe(
      catchError((error) => {
        console.error('Error fetching click count', error);
        return of(0);
      })
    );
  }

  trackUserLocation(idproduct: number, trackingData: any): Observable<any> {
    return this.http.post(`${this.url}/tracking/${idproduct}/${trackingData.sessionId}`, trackingData).pipe(
      tap(() => console.log('Tracking data sent for session:', trackingData.sessionId)),
      catchError((error) => {
        console.error('Error sending tracking data:', error);
        return of(null);
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
