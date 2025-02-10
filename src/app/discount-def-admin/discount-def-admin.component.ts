import { Component } from '@angular/core';
import { Data, Router } from '@angular/router';
import { DiscountDefService } from '../discount-def.service';

@Component({
  selector: 'app-discount-def-admin',
  templateUrl: './discount-def-admin.component.html',
  styleUrl: './discount-def-admin.component.css'
})
export class DiscountDefAdminComponent {
  discounts: any[] = []; 
  


  constructor(private DiscDefServ: DiscountDefService,private router: Router) {}

  ngOnInit(): void {
    this.loadDiscounts();
  }

  loadDiscounts(): void {
     this.DiscDefServ.getDiscountDef().subscribe(
      (data) => {
        this.discounts = data;
      },
      (error) => {
        console.error('Error to get DiscountDef:', error);
      }
    );
  }
  //modifier une remise specifique 
  editDiscount(discount: any): void {
    this.router.navigate(['/dashboard/edit-discount', discount.idDisc]);
}


  // Supprimer une remise spécifique
  deleteDiscount(idDisc: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette remise ?')) {
      this.DiscDefServ.deleteDiscountDef(idDisc).subscribe(
        () => {
          this.loadDiscounts();
        },
        (error) => {
          console.error('Erreur lors de la suppression:', error);
        }
      );
    }
  }
}


