import { Component, OnInit } from '@angular/core';
import { ProductService } from '../product.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-services-internet',
  templateUrl: './services-internet.component.html',
  styleUrl: './services-internet.component.css'
})
export class ServicesInternetComponent implements OnInit {
  products: any[] = [];
  category: string = '';

  constructor(private route: ActivatedRoute, private productService: ProductService,private router: Router) {}
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

  goToDetails(prod: any): void {
    this.router.navigate(['/detailsClientsProd', prod.idproduct]);
}
}
