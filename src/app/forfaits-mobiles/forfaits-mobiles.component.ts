import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../product.service';

@Component({
  selector: 'app-forfaits-mobiles',
  templateUrl: './forfaits-mobiles.component.html',
  styleUrl: './forfaits-mobiles.component.css'
})
export class ForfaitsMobilesComponent  implements OnInit {
  products: any[] = [];

  constructor(private ProdServ: ProductService, private router: Router) {}

  ngOnInit(): void {
    this.ProdServ.getProductsByCategory('ForfaitsMobiles').subscribe((data) => {
      this.products = data;
    });
  }

  EnvoieId(productId: number): void {
   
    this.router.navigate(['/trace', productId]);
  }
}
