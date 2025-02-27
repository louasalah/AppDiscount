import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../product.service';

@Component({
  selector: 'app-smartphones',
  templateUrl: './smartphones.component.html',
  styleUrls: ['./smartphones.component.css']
})
export class SmartphonesComponent implements OnInit {
  products: any[] = [];
  category: string = '';

  constructor(private route: ActivatedRoute, private productService: ProductService) {}

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
}
