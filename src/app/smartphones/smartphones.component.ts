import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService, ProductWithDiscountDTO } from '../product.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-smartphones',
  templateUrl: './smartphones.component.html',
  styleUrls: ['./smartphones.component.css']
})
export class SmartphonesComponent implements OnInit {
  products: any[] = [];
  nom: string = '';
  description: string = '';  

  constructor(private route: ActivatedRoute, private productService: ProductService,private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const nom = params.get('nom');
      console.log("my name", nom); 
      if (nom) {
        this.loadProducts(nom);
      }
    });
  }
  

  loadProducts(nom: string): void {
    this.productService.getProductsByCategory(nom).subscribe(data => {
      this.products = data;
      console.log('Products for category:', nom, this.products);
    });
  }
  
  // Méthode pour rechercher des produits par nom et catégorie
  
  onSearch(): void {
    if (this.nom && this.description) {  // Vérification que les deux champs sont remplis
      console.log('Searching for products with category:', this.nom, 'and description:', this.description);
      
      // Appel au service pour récupérer les produits
      this.productService.searchProducts(this.nom, this.description).subscribe(
        (data: ProductWithDiscountDTO[]) => {
          this.products = data;
          console.log('Searched products:', this.products);
        },
        (error: HttpErrorResponse) => {  // Gestion de l'erreur avec HttpErrorResponse
          console.error('Error during search:', error.message);
        }
      );
    } else {
      console.log('Please provide both category and description for search.');
    }
  }


  goToDetails(prod: any): void {
    this.router.navigate(['/detailsClientsProd', prod.productId]);
}
}