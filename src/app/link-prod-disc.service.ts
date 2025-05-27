import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LinkProdDiscService {
private url = 'http://localhost:8080/aapiee';
  constructor(private http: HttpClient) { }
  addLinkProdDisc(linkData: any): Observable<any> {
    return this.http.post<any>(`http://localhost:8080/aapiee/add`, linkData);
  }

  getLinks(): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/getlinks`);
  }
  
  prolongerLien(idLink: number, payload: { jours: number, active: boolean }) {
    const id =idLink
    return this.http.put(`http://localhost:8080/aapiee/prolonger/${id}`, payload);
  }
  
}
