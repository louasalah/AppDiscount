import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProductService } from '../product.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-product-admin',
  templateUrl: './product-admin.component.html',
  styleUrls: ['./product-admin.component.css'] 
})
export class ProductAdminComponent implements OnInit{
  products: any[] = [];


  constructor(private ProdServ: ProductService,private router: Router) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
     this.ProdServ.getProductsAdmin().subscribe(
      (data) => {
        this.products = data;
      },
      (error) => {
        console.error('Error to get  products:', error);
      }
    );
  }
   // Modifier un produit
   editProduct(prod: any): void {
    this.router.navigate(['/dashboard/edit-produit', prod.idproduct]);
  }

  // Supprimer un produit
  deleteProduct(idproduct: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      this.ProdServ.deleteProduct(idproduct).subscribe(
        () => {
          this.loadProducts(); 
        },
        (error) => {
          console.error('Erreur lors de la suppression:', error);
        }
      );
    }
  }
}