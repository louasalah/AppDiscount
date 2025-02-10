import { Component } from '@angular/core';
import { ProductService } from '../product.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-smartphones',
  templateUrl: './smartphones.component.html',
  styleUrl: './smartphones.component.css'
})
export class SmartphonesComponent {
products: any[] = [];

  constructor(private ProdServ: ProductService, private router: Router) {}

  ngOnInit(): void {
    this.ProdServ.getProductsByCategory('Smartphone').subscribe((data) => {
      this.products = data;
    });
  }

  EnvoieId(productId: number): void {
   
    this.router.navigate(['/trace', productId]);
  }
}
