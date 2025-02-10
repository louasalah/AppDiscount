import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DiscountDefService {
  private url = 'http://localhost:8080/apie';
  constructor(private http: HttpClient) { }

   // Service pour obtenir les définitions de remises
   getDiscountDef(): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/discounts`); 
  }
     // Service pour obtenir les définitions de remises selon l'ID
  getDiscountDefById(id: number): Observable<any> {
    return this.http.get<any>(`${this.url}/discounts/${id}`); 
  }
  // Service pour mettre à jour la définition de remise
  updateDiscountDef(idDisc: number, discountData: any): Observable<any> {
    return this.http.put<any>(`${this.url}/discounts/${idDisc}`, discountData); 
  }

  // Service pour supprimer la définition de remise
  deleteDiscountDef(id: number): Observable<any> {
    return this.http.delete<any>(`${this.url}/discounts/${id}`); 
  }
}
