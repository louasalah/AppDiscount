import { Component, OnInit } from '@angular/core';
import { ProductService } from '../product.service';
import { DiscountDefService } from '../discount-def.service';
import { LinkProdDiscService } from '../link-prod-disc.service';
@Component({
  selector: 'app-link-disc-product',
  templateUrl: './link-disc-product.component.html',
  styleUrls: ['./link-disc-product.component.css']
})
export class LinkDiscProductComponent implements OnInit {
  products: any[] = [];
  discounts: any[] = [];
  Links: any[] = [];
  selectedProductId: number=0;
  selectedDiscountId: number=0;
  selectedProduct: any = null;    
  selectedDiscount: any = null;
  link: any = {
    idproduct:0,
    idDisc:0,
    active: false,
    duration: 0,
    valideFrom: '',
    valideTo: '',
    priority: 'Medium'
  };
  

  constructor(
    private ProdServ: ProductService,
    private DiscDefServ: DiscountDefService,
    private LPDService: LinkProdDiscService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadDiscounts();
    this.loadLinkDiscProd();

    console.log("test",this.Links)
  }

  loadProducts(): void {
    this.ProdServ.getProductsAdmin().subscribe(
      (data) => { this.products = data; },
      (error) => { console.error('Erreur lors du chargement des produits:', error); }
    );
  }

  loadDiscounts(): void {
    this.DiscDefServ.getDiscountDef().subscribe(
      (data) => { this.discounts = data; },
      (error) => { console.error('Erreur lors du chargement des remises:', error); }
    );
  }

  loadLinkDiscProd(): void {
    this.LPDService.getLinks().subscribe(
      (data) => { this.Links = data;
        console.log("test",data)
       },
      (error) => { console.error('Erreur lors du chargement des liens:', error); }
    );
  }

  selectProduct(productId: number): void {
    this.selectedProductId = productId;
    this.ProdServ.getProductById(productId).subscribe(
    (data) => { 
      this.selectedProduct = data;
      // if (this.selectedProduct) {
      //   this.loadApplicableDiscounts(this.selectedProduct.price); 
      // }
    },
    (error) => { console.error('Erreur lors du chargement du produit:', error); }
  );
  
}

 

  selectDiscount(discountId: number): void {
    this.selectedDiscountId = discountId;
    this.DiscDefServ.getDiscountDefById(discountId).subscribe(
      (data) => { this.selectedDiscount = data; },
      (error) => { console.error('Erreur lors du chargement de la remise:', error); }
    );
  }

  linkProductToDiscount(): void {
    if (!this.selectedProduct || !this.selectedDiscount) {
      alert('Veuillez sélectionner un produit et une remise.');
      return;
    }

    const linkData = {
      idproduct: this.selectedProduct.idproduct,  
      idDisc: this.selectedDiscount.idDisc,
      active: false,
      duration: this.link.duration,
      valideFrom: this.link.valideFrom,
      valideTo: this.link.valideTo,
      priority: this.link.priority,
 
    };
      
   
    this.LPDService.addLinkProdDisc(linkData).subscribe(
      (response) => {
        console.log('Réponse du backend:', response);     
        this.loadLinkDiscProd(); 
      },
      (error) => {
        console.error('Erreur lors de l’ajout du lien:', error);
      }
    );
  }
  // prolongerLien(link: any) {
  //   // Appel à l'API backend pour prolonger ce lien spécifique
  //   this.LPDService.prolongerLien(link.idLink).subscribe({
  //     next: () => {
  //       alert('Remise prolongée avec succès !');
  //       this.loadLinkDiscProd(); // Recharge la liste des liens
  //     },
  //     error: err => {
  //       console.error(err);
  //       alert("Erreur lors de la prolongation");
  //     }
  //   });
  // }
  





  prolongerLien(link: any) {
    const joursProlongation = prompt("Combien de jours voulez-vous prolonger cette remise ?", "7");
  
    if (joursProlongation !== null) {
      const jours = parseInt(joursProlongation, 10);
  
      if (isNaN(jours) || jours <= 0) {
        alert("Veuillez entrer un nombre de jours valide.");
        return;
      }
  
      const payload = {
        jours: jours,
        active: true // ou false selon le cas (tu peux aussi laisser l’utilisateur choisir)
      };
  
      this.LPDService.prolongerLien(link.idLink, payload).subscribe({
        next: () => {
          alert('Remise prolongée avec succès !');
          this.loadLinkDiscProd(); // Recharge la liste
        },
        error: err => {
          console.error(err);
          alert("Erreur lors de la prolongation");
        }
      });
    }
  }
  
} 