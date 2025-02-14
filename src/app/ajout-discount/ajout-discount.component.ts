import { Component } from '@angular/core';
import { DiscountDefService } from '../discount-def.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-ajout-discount',
  templateUrl: './ajout-discount.component.html',
  styleUrl: './ajout-discount.component.css'
})
export class AjoutDiscountComponent {
  discount: any = {}; 
  errorMessage: string = ''; 
  successMessage: string = '';


  constructor(private DiscDefServ: DiscountDefService, private router: Router) {}

  AddDiscount(): void {
    this.DiscDefServ.AjoutDiscount(this.discount).subscribe(
      (response) => {
        // Si la réponse est OK, rediriger l'utilisateur
          this.successMessage = 'Remise ajoutée avec succès!';
          this.router.navigate(['/dashboard/DiscountDefAdmin']);
      },
      (error) => {
        if (error.status === 400) {
          this.errorMessage = 'La référence de remise existe déjà.';

        } else {
          console.error('Erreur lors de l\'ajout de la remise:', error);
        }
      }
    );
  }
}