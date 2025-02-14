import { Component, OnInit } from '@angular/core';
import { ProductService } from '../product.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-edit-produit',
  templateUrl: './edit-produit.component.html',
  styleUrls: ['./edit-produit.component.css']
})
export class EditProduitComponent implements OnInit {
  products: any = {};
  idProd: number | null = null;
  constructor(
    private ProdServ: ProductService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.idProd = +this.route.snapshot.paramMap.get('id')!;
    this.loadProduct();
  }

  // Charger les informations du produit par ID
  loadProduct(): void {
    if (this.idProd !== null) {
      this.ProdServ.getProductById(this.idProd).subscribe(
        (product) => {
          this.products = product;
        },
        (error) => {
          console.error('Erreur lors de la récupération du produit:', error);
        }
      );
    }
  }

  // Mettre à jour le produit
  updateProduct(): void {
    if (this.idProd !== null) {
      this.ProdServ.updateProduct(this.idProd, this.products).subscribe(
        (response) => {
          console.log('Produit mis à jour avec succès', response);
          this.router.navigate(['/dashboard/productadmin']);
        },
        (error) => {
          console.error('Erreur lors de la mise à jour du produit', error);
        }
      );
    }
  }
}
