import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../product.service';

@Component({
  selector: 'app-detail-prod-clients',
  templateUrl: './detail-prod-clients.component.html',
  styleUrl: './detail-prod-clients.component.css'
})
export class DetailProdClientsComponent implements OnInit {
  products: any = {};
  idproduct: number | null = null;

  constructor(private route: ActivatedRoute, private productService: ProductService,private router: Router) {}

  
  ngOnInit(): void {
    // Récupérer l'id du produit depuis la route
    this.idproduct = +this.route.snapshot.paramMap.get('idproduct')!;
    if (this.idproduct) {
      this.loadProductDetails(this.idproduct);  // Charger les détails du produit
    } else {
      console.error("No product ID found in route");
    }
  }

  loadProductDetails(idproduct: number): void {
    this.productService.getProductDetails(idproduct).subscribe(
      (data) => {
        this.products = data;
        console.log("Product details loaded:", this.products);
      },
      (error) => {
        console.error('Error fetching product details:', error);
      }
    );
  }
  goToTracage(prod: any): void {
    this.router.navigate(['dashboard/trace', prod.idproduct]);
}


}