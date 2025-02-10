import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HolidaysService } from '../holidays.service';

@Component({
  selector: 'app-edit-holidays',
  templateUrl: './edit-holidays.component.html',
  styleUrl: './edit-holidays.component.css'
})
export class EditHolidaysComponent {
holid: any = {};
IDHolid: number | null = null;

  constructor(
  private HolidServ :HolidaysService,
  private router:Router,
  private route: ActivatedRoute,
   
  ) {}

  ngOnInit(): void {
    this.IDHolid = +this.route.snapshot.paramMap.get('id')!;
    this.loadHoliday();
  }

  // Charger les informations du holidays par ID
  loadHoliday(): void {
    if (this.IDHolid !== null) {
      this.HolidServ.getHolidaysById(this.IDHolid).subscribe(
        (product) => {
          this.holid = product;
        },
        (error) => {
          console.error('Erreur lors de la récupération du produit:', error);
        }
      );
    }
  }

  // Mettre à jour le holiday
  updateHoliday(): void {
    if (this.IDHolid !== null) {
      this.HolidServ.updateHoliday(this.IDHolid, this.holid).subscribe(
        (updatedDiscount) => {
          this.holid = updatedDiscount;
          this.router.navigate(['/Holidays']); 
        },
        (error) => {
          console.error('Erreur lors de la modification du holiday:', error);
        }
      );
    }
  }
}
