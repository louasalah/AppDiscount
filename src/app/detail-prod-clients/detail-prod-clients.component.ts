import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../product.service';
import { TrackingService } from '../tracking.service';
import Swal from 'sweetalert2';
import { CouponService } from '../coupon.service';

@Component({
  selector: 'app-detail-prod-clients',
  templateUrl: './detail-prod-clients.component.html',
  styleUrls: ['./detail-prod-clients.component.css']
})
export class DetailProdClientsComponent implements OnInit, OnDestroy {
  products: any = {};
  idproduct: number | null = null;
  latitude: number | null = null;
  longitude: number | null = null;
  clicks: number = 0;
  timeSpent: number = 0;
  pagename: string = '';
  timerInterval: any;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private router: Router,
    private trackserv: TrackingService,
    private couponService:CouponService
  ) {}

  ngOnInit(): void {
    this.idproduct = +this.route.snapshot.paramMap.get('idproduct')!;
    this.pagename = this.router.url;

    if (this.idproduct) {
      this.getUserLocation();
      this.loadProductDetails(this.idproduct);
      this.startTimer();
    } else {
      console.error('No product ID found in route');
    }
  }

  getUserLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.latitude = position.coords.latitude;
          this.longitude = position.coords.longitude;
          this.trackUserLocation();
        },
        (error) => {
          console.error('Geolocation error: ', error);
          this.latitude = 0;
          this.longitude = 0;
        }
      );
    }
  }

  loadProductDetails(idproduct: number): void {
    this.productService.getProductDetails(idproduct).subscribe(
      (data) => {
        this.products = data;
        this.trackserv.getClickCount(idproduct).subscribe(
          (clickCount) => {
            this.clicks = clickCount;
          }
        );
      }
    );
  }

  handleClick(): void {
    if (this.idproduct) {
      this.trackserv.trackClick(this.idproduct).subscribe(() => {
        this.clicks++;
        console.log(`Clic enregistré ! Nombre de clics : ${this.clicks}`);
        this.trackUserLocation();
      });
    }
  }

  startTimer(): void {
    this.timerInterval = setInterval(() => {
      this.timeSpent++;
      console.log(`Temps passé : ${this.timeSpent} secondes`);
    }, 1000);
  }

  trackUserLocation(): void {
    if (this.latitude !== null && this.longitude !== null && this.idproduct !== null) {
      const trackingData = {
        latitude: this.latitude,
        longitude: this.longitude,
        productId: this.idproduct,
        clicks: this.clicks,
        timeSpent: this.timeSpent,
        pagename: this.pagename
      };

      this.trackserv.trackUserLocation(this.idproduct, trackingData).subscribe(
        () => console.log('Données de suivi envoyées !'),
        (error) => console.error('Erreur lors de l’envoi des données de suivi :', error)
      );
    }
  }

  ngOnDestroy(): void {
    clearInterval(this.timerInterval);
    this.trackUserLocation();
  }



  //envoie email
 

// Afficher la modale pour l'email
getCoupon() {
  Swal.fire({
    title: 'Obtenez votre coupon !',
    input: 'email',
    inputLabel: 'Adresse e-mail',
    inputPlaceholder: 'Entrez votre e-mail',
    showCancelButton: true,
    confirmButtonText: 'Envoyer',
    cancelButtonText: 'Annuler',
    preConfirm: (email: string) => {  // 🔧 Typage de 'email'
      if (!email) {
        Swal.showValidationMessage('Veuillez saisir une adresse e-mail valide');
      }
      return email;
    }
  }).then((result: any) => { // 🔧 Typage de 'result'
    if (result.isConfirmed && result.value) {
      this.DemandeCouponEmail(result.value);
    }
  });
}

// Appel API pour envoyer l'e-mail
DemandeCouponEmail(email: string) {  // 🔧 Typage de 'email'
  this.couponService.DemandeCouponEmail(email).subscribe(
    (response) => {
      Swal.fire('Succès', 'Le coupon a été envoyé avec succès !', 'success');
    },
    (error) => {
      Swal.fire('Erreur', 'Une erreur s\'est produite lors de l\'envoi.', 'error');
    }
  );
}
}