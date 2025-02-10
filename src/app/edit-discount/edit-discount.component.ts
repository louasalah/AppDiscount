import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DiscountDefService } from '../discount-def.service';

@Component({
  selector: 'app-edit-discount',
  templateUrl: './edit-discount.component.html',
  styleUrls: ['./edit-discount.component.css']
})
export class EditDiscountComponent {
  discount: any = {};  
  idDisc: number | null = null;  

  constructor(
    private DiscDefServ: DiscountDefService, 
    private route: ActivatedRoute,  
    private router: Router
  ) {}

  ngOnInit(): void {
    this.idDisc = +this.route.snapshot.paramMap.get('id')!; 
    this.loadDiscount();
  }

  // Charger les informations de la remise depuis le backend
  loadDiscount(): void {
    if (this.idDisc !== null) {
      this.DiscDefServ.getDiscountDefById(this.idDisc).subscribe(
        (discounts) => {
          this.discount = discounts; 
        },
        (error) => {
          console.error('Erreur lors de la récupération de la remise:', error);
        }
      );
    }
  }

  updateDiscount(): void {
    if (this.idDisc !== null) {
      this.DiscDefServ.updateDiscountDef(this.idDisc, this.discount).subscribe(
        (updatedDiscount) => {
          this.discount = updatedDiscount;
          this.router.navigate(['/DiscountDefAdmin']); 
        },
        (error) => {
          console.error('Erreur lors de la modification de la remise:', error);
        }
      );
    }
  }
}
