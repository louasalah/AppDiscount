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
  sessionId: string;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private router: Router,
    private trackserv: TrackingService,
    private couponService: CouponService
  ) {
    // Get or create session ID
    this.sessionId = this.getOrCreateSessionId();

    // Écouter l'événement beforeunload pour détecter la fermeture du navigateur
    window.addEventListener('beforeunload', () => {
      // Générer un nouveau sessionId et le sauvegarder
      const newSessionId = this.generateSessionId();
      localStorage.setItem('tracking_session_id', newSessionId);
    });
  }

  private generateSessionId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private getOrCreateSessionId(): string {
    let sessionId = localStorage.getItem('tracking_session_id');
    if (!sessionId) {
      sessionId = this.generateSessionId();
      localStorage.setItem('tracking_session_id', sessionId);
    }
    return sessionId;
  }

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

  startTimer(): void {
    this.timerInterval = setInterval(() => {
      this.timeSpent++;
      if (this.timeSpent % 5 === 0) { // Send tracking data every 5 seconds
        this.trackUserLocation();
      }
    }, 1000);
  }

  trackUserLocation(): void {
    if (this.latitude !== null && this.longitude !== null && this.idproduct !== null) {
      const trackingData = {
        latitude: this.latitude,
        longitude: this.longitude,
        productId: this.idproduct,
        sessionId: this.sessionId,
        timespent: this.timeSpent,
        pagename: this.pagename
      };

      this.trackserv.trackUserLocation(this.idproduct, trackingData).subscribe(
        () => console.log('Tracking data sent successfully', trackingData),
        (error) => console.error('Error sending tracking data:', error)
      );
    }
  }

  ngOnDestroy(): void {
    clearInterval(this.timerInterval);
    // Send final tracking data before component is destroyed
    this.trackUserLocation();
  }

  getCoupon() {
    Swal.fire({
      title: 'Obtenez votre coupon !',
      input: 'email',
      inputLabel: 'Adresse e-mail',
      inputPlaceholder: 'Entrez votre e-mail',
      showCancelButton: true,
      confirmButtonText: 'Envoyer',
      cancelButtonText: 'Annuler',
      preConfirm: (email: string) => {
        if (!email) {
          Swal.showValidationMessage('Veuillez saisir une adresse e-mail valide');
        }
        return email;
      }
    }).then((result: any) => {
      if (result.isConfirmed && result.value) {
        this.DemandeCouponEmail(result.value);
      }
    });
  }

  DemandeCouponEmail(email: string) {
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