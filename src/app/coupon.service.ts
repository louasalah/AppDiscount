import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CouponService {
  private url = 'http://localhost:8080/api/coupons'; 

  constructor(private http: HttpClient) {}

  // Méthode pour envoyer un coupon par e-mail
  DemandeCouponEmail(email: string): Observable<any> {
    return this.http.post(`${this.url}/sendcoupon`, { email });
  }

  //Méthode pour récupérer les logs d'envoi (pour la page admin)
  getTrackingLogs(): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/trackinglogs`);
  }
}