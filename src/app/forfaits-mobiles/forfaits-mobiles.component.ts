import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../product.service';

@Component({
  selector: 'app-forfaits-mobiles',
  templateUrl: './forfaits-mobiles.component.html',
  styleUrl: './forfaits-mobiles.component.css'
})
export class ForfaitsMobilesComponent  implements OnInit {
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
  