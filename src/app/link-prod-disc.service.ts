import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LinkProdDiscService {
private url = 'http://localhost:8080/aapie';
  constructor(private http: HttpClient) { }
  addLinkProdDisc(linkData: any): Observable<any> {
    return this.http.post<any>(`${this.url}/add`, linkData);
  }

  getLinks(): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/getlinks`);
  }
}