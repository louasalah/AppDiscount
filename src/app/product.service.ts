import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface ProductWithDiscountDTO {
  idproduct: number;
  description: string;
  price: number;
  discountedPrice: number;
  imageUrl: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private url = 'http://localhost:8080/api';
  
  constructor(private http: HttpClient) { }
  
  getCategory(): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/categories/allcatego`);
  }
  
  
  getStaticsProduct(): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/statistics/most-viewed-products`);
  }
  
  // Service pour les produits par catégorie pour les clients
  getProductsByCategory(nom: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/products/category/${nom}`);
  }
  
  // service pour recupere le produit pour le component detailprod
  getProductDetails(idproduct: number): Observable<any> {
    return this.http.get<any>(`${this.url}/products/prodDetail/${idproduct}`);
  }
  
  // Service pour obtenir tous les produits
  getProductsAdmin(): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/all`);
  }
  getRemiseProduct(): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:8080/aapiee/remise-recente-preferee`);
  }
  
  // Service pour obtenir un produit par ID
  getProductById(id: number): Observable<any> {
    return this.http.get<any>(`${this.url}/products/${id}`);
  }

    getProdByIdWithDiscount(id: number): Observable<any> {
    return this.http.get<any>(`${this.url}/getProdByIdWithDiscount/${id}`);
  }
  
  // Service pour mettre à jour un produit
  updateProduct(idProd: number, productData: any): Observable<any> {
    return this.http.put<any>(`${this.url}/products/${idProd}`, productData);
  }
  
  deleteProduct(idproduct: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/products/${idproduct}`);
  }
  
  //service pour la recherche
  searchProducts(nom: string, description: string): Observable<ProductWithDiscountDTO[]> {
    return this.http.get<ProductWithDiscountDTO[]>(`${this.url}/products/search/description/${description}?nom=${nom}`);
  }
}