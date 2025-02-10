import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HolidaysService } from '../holidays.service';

@Component({
  selector: 'app-holidays',
  templateUrl: './holidays.component.html',
  styleUrl: './holidays.component.css'
})
export class HolidaysComponent {
  holid: any[] = []; 
    constructor(private HolidServ:HolidaysService,private router: Router) {}
  

  ngOnInit(): void {
    this.loadHolidays();
  }

  loadHolidays(): void {
     this.HolidServ.getHolidays().subscribe(
      (data) => {
        this.holid = data;
      },
      (error) => {
        console.error('Error to get Holidays:', error);
      }
    );
  }
  //modifier une holidays specifique 
  editHolidays(holid: any): void {
    this.router.navigate(['/dashboard/edit-Holidays', holid.IDHolid]);
}


  // Supprimer une holidays spécifique
  deleteHolidays(IDHolid: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette holiday ?')) {
      this.HolidServ.deleteHolidays(IDHolid).subscribe(
        () => {
          this.loadHolidays();
        },
        (error) => {
          console.error('Erreur lors de la suppression:', error);
        }
      );
    }
  }
}


