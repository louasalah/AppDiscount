import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, of } from 'rxjs';
import { debounceTime } from 'rxjs/operators'; 

@Injectable({
  providedIn: 'root',
})
export class TrackingService {
  private url = 'http://localhost:8080/Api';
  private clicksSubject = new BehaviorSubject<number>(0);
  private startTime: { [PageName: string]: number } = {};  
  constructor(private http: HttpClient) {}

  getClickCount(): Observable<number> {
    return this.clicksSubject.asObservable();
  }

  traceClick(productId: number): Observable<any> {
    const data = {
      productId: productId,
      clicks: 1,
    };
    const currentClicks = this.clicksSubject.value;
    this.clicksSubject.next(currentClicks + 1);
    return this.http.post(`${this.url}/tracking`, data).pipe(
      catchError(this.handleError('traceClick'))
    );
  }

 
  
  startTracking(PageName: string): void {
    this.startTime[PageName] = Date.now();
  }

  traceTimeSpent(PageName: string): Observable<any> {
    const TimeSpent = Math.floor((Date.now() - this.startTime[PageName]) / 1000);
    const data = {
      PageName: PageName,
      TimeSpent: TimeSpent,
    };
    return this.http.post(`${this.url}/tracking`, data).pipe(
      debounceTime(300), 
      catchError(this.handleError('traceTempsPasse'))
    );
  }

  private handleError(operation = 'operation') {
    return (error: any): Observable<any> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(null);  
    };
  }
}
