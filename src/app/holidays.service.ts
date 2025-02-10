import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HolidaysService {
   private url = 'http://localhost:8080/app';
  constructor(private http: HttpClient) { }

  getHolidays(): Observable<any[]> {
      return this.http.get<any[]>(`${this.url}/holiday`); 
    }

  // Service pour obtenir les holidays selon l'ID
  getHolidaysById(id: number): Observable<any> {
    return this.http.get<any>(`${this.url}/discounts/${id}`); 
  }
  // Service pour mettre à jour holidays
  updateHoliday(idDisc: number, discountData: any): Observable<any> {
    return this.http.put<any>(`${this.url}/discounts/${idDisc}`, discountData); 
  }
  // Service pour supprimer holiday
  deleteHolidays(id: number): Observable<any> {
    return this.http.delete<any>(`${this.url}/holiday/${id}`); 
  }
}

