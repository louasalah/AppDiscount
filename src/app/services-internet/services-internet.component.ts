import { Component } from '@angular/core';
import { ProductService } from '../product.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-services-internet',
  templateUrl: './services-internet.component.html',
  styleUrl: './services-internet.component.css'
})
export class ServicesInternetComponent {
products: any[] = [];

  constructor(private ProdServ: ProductService, private router: Router) {}

  ngOnInit(): void {
    this.ProdServ.getProductsByCategory('ServicesInternet').subscribe((data) => {
      this.products = data;
    });
  }

  EnvoieId(productId: number): void {
   
    this.router.navigate(['/trace', productId]);
  }
}
