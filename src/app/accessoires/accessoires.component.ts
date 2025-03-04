import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../product.service';

@Component({
  selector: 'app-accessoires',
  templateUrl: './accessoires.component.html',
  styleUrl: './accessoires.component.css'
})
export class AccessoiresComponent implements OnInit {
  products: any[] = [];
    category: string = '';

  
    constructor(private route: ActivatedRoute, private productService: ProductService,private router: Router  // ✅ Ajout de private pour injecter le router
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

    goToDetails(prod: any): void {
      this.router.navigate(['/detailsClientsProd', prod.idproduct]);
  }
  }
  
