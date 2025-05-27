import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../product.service';
import { TrackingService } from '../tracking.service';
import Swal from 'sweetalert2';
import { CouponService } from '../coupon.service';
interface ProductStatistics {
  mostViewedProducts: Array<[number | string, any]>; // Adjust the type based on your actual data structure
  // Add other properties that might be in your statistics data
}
@Component({
  selector: 'app-detail-prod-clients',
  templateUrl: './detail-prod-clients.component.html',
  styleUrls: ['./detail-prod-clients.component.css']
})
export class DetailProdClientsComponent implements OnInit, OnDestroy {
  products: any = {};
  product: any = null; // Pour correspondre au *ngIf="product" du HTML
  idproduct: number | null = null;
  latitude: number | null = null;
  longitude: number | null = null;
  clicks: number = 0;
  timeSpent: number = 0;
  pagename: string = '';
  timerInterval: any;
  sessionId: string;
  
  // Variables pour les fonctionnalités du produit
  selectedImageIndex: number = 0;
  selectedVariant: number | null = null;
  selectedCapacity: string | null = null;
  quantity: number = 1;
  activeTab: string = 'description';
  
  // Pour les avis
  newReview: any = {
    rating: 0,
    title: '',
    content: '',
    author: 'Utilisateur',
    date: new Date()
  };
  
  // Pour les produits similaires
   relatedProducts: any[] = [];
  mostViewedProductss: any[] = [];
  // Mock pour les avis si nécessaire
  mockReviews: any[] = [
    {
      author: 'Sophie D.',
      date: new Date('2025-04-12'),
      rating: 5,
      title: 'Excellent produit !',
      content: 'Je suis très satisfaite de mon achat. La qualité est au rendez-vous et le rapport qualité-prix est excellent.'
    },
    {
      author: 'Thomas M.',
      date: new Date('2025-03-28'),
      rating: 4,
      title: 'Très bon produit',
      content: 'Bon produit dans l\'ensemble, seule la batterie pourrait être améliorée.'
    }
  ];

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
      console.log(" data:", this.relatedProducts);
    this.idproduct = +this.route.snapshot.paramMap.get('idproduct')!;
    this.pagename = this.router.url;
    this.loadMostViewedProducts()
    if (this.idproduct) {
      this.getUserLocation();
      this.loadProductDetails(this.idproduct);
       this.loadMostViewedProducts()
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
              this.product = data; // Assigner à la propriété product également
              console.log("rrr",this.products) 
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
      console.log("test idproduct",trackingData.productId)
      this.trackserv.trackUserLocation(trackingData.productId, trackingData).subscribe(
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
    const idproduct=this.idproduct
    this.couponService.DemandeCouponEmail(email,idproduct).subscribe(
      (response) => {
        Swal.fire('Succès', 'Le coupon a été envoyé avec succès !', 'success');
      },
      (error) => {
        Swal.fire( 'Erreur', error.error);
      }
    );
  }

  // Nouvelles fonctions manquantes

  /**
   * Sélectionne une image dans la galerie
   */
  selectImage(index: number): void {
    this.selectedImageIndex = index;
    if (this.product && this.product.additionalImages && this.product.additionalImages.length > index) {
      this.product.imageUrl = this.product.additionalImages[index];
    }
  }

  /**
   * Calcule le pourcentage de réduction
   */
  calculateDiscountPercentage(originalPrice: number, discountedPrice: number): number {

    return (discountedPrice);
  }

  /**
   * Vérifie si un produit est nouveau (moins de 30 jours)
   */
  isNewProduct(product: any): boolean {
    if (!product || !product.releaseDate) return false;
    const releaseDate = new Date(product.releaseDate);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - releaseDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30;
  }

  /**
   * Sélectionne une variante du produit
   */
  selectVariant(variantId: number): void {
    this.selectedVariant = variantId;
    // Ici vous pourriez mettre à jour l'image ou le prix selon la variante sélectionnée
  }

  /**
   * Sélectionne une capacité du produit
   */
  selectCapacity(capacityValue: string): void {
    this.selectedCapacity = capacityValue;
    // Ici vous pourriez mettre à jour le prix selon la capacité sélectionnée
  }

  /**
   * Diminue la quantité
   */
  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  

  /**
   * Augmente la quantité
   */
  increaseQuantity(): void {
    this.quantity++;
  }

  /**
   * Met à jour la quantité depuis l'entrée utilisateur
   */
  updateQuantity(event: Event): void {
    const target = event.target as HTMLInputElement;
    let value = parseInt(target.value);
    
    if (isNaN(value) || value < 1) {
      value = 1;
    }
    
    this.quantity = value;
  }

  /**
   * Ajoute le produit au panier
   */
  addToCart(): void {
    if (!this.product) return;
    
    const productToAdd = {
      id: this.product.productId,
      name: this.product.description,
      price: this.product.discountedPrice,
      quantity: this.quantity,
      variant: this.selectedVariant,
      capacity: this.selectedCapacity,
      imageUrl: this.product.imageUrl
    };
    
    // Ici vous appelleriez votre service de panier
    // Exemple: this.cartService.addToCart(productToAdd);
    
    Swal.fire({
      title: 'Produit ajouté au panier !',
      icon: 'success',
      timer: 2000,
      showConfirmButton: false
    });
  }

  /**
   * Ajoute/Supprime le produit des favoris
   */
  toggleWishlist(): void {
    if (!this.product) return;
    
    this.product.inWishlist = !this.product.inWishlist;
    
    // Ici vous appelleriez votre service de favoris
    // Exemple: this.wishlistService.toggleWishlist(this.product.productId);
    
    const message = this.product.inWishlist ? 
      'Produit ajouté aux favoris !' : 
      'Produit retiré des favoris !';
    
    Swal.fire({
      title: message,
      icon: 'success',
      timer: 2000,
      showConfirmButton: false
    });
  }

  /**
   * Définit l'onglet actif
   */
  setActiveTab(tabName: string): void {
    this.activeTab = tabName;
  }

  /**
   * Calcule le pourcentage pour un niveau d'évaluation
   */
  calculateRatingPercentage(ratingLevel: number): number {
    if (!this.product || !this.product.reviews || this.product.reviews.length === 0) {
      // Valeurs par défaut pour la démo
      const defaultPercentages = {
        5: 60,
        4: 25,
        3: 10,
        2: 3,
        1: 2
      };
      return defaultPercentages[ratingLevel as keyof typeof defaultPercentages] || 0;
    }
    
    const totalReviews = this.product.reviews.length;
    const reviewsWithRating = this.product.reviews.filter((review: any) => review.rating === ratingLevel).length;
    
    return Math.round((reviewsWithRating / totalReviews) * 100);
  }

  /**
   * Définit la note pour un nouvel avis
   */
  setReviewRating(rating: number): void {
    this.newReview.rating = rating;
  }

  /**
   * Soumet un nouvel avis
   */
  submitReview(): void {
    if (!this.newReview.rating || !this.newReview.title || !this.newReview.content) {
      Swal.fire('Erreur', 'Veuillez remplir tous les champs', 'error');
      return;
    }
    
    // Créer une copie du nouvel avis avec la date actuelle
    const reviewToSubmit = {
      ...this.newReview,
      date: new Date()
    };
    
    // Ici vous appelleriez votre service d'avis
    // Exemple: this.reviewService.submitReview(this.idproduct, reviewToSubmit);
    
    // Pour la démo, ajoutons l'avis à la liste locale
    if (!this.product.reviews) {
      this.product.reviews = [];
    }
    
    this.product.reviews.unshift(reviewToSubmit);
    
    // Mise à jour du nombre d'avis
    if (!this.product.reviewCount) {
      this.product.reviewCount = 0;
    }
    this.product.reviewCount++;
    
    // Recalcul de la note moyenne
    const totalRating = this.product.reviews.reduce((sum: number, review: any) => sum + review.rating, 0);
    this.product.averageRating = totalRating / this.product.reviews.length;
    
    // Réinitialiser le formulaire
    this.newReview = {
      rating: 0,
      title: '',
      content: '',
      author: 'Utilisateur',
      date: new Date()
    };
    
    Swal.fire('Succès', 'Votre avis a été soumis avec succès !', 'success');
  }

  /**
   * Charge les produits similaires
   */

loadMostViewedProducts(): void {
  this.productService.getStaticsProduct().subscribe(
    (data: any[]) => { // Expecting an array of product objects
      console.log("Statistics data:", data);
      
      if (data && Array.isArray(data)) {
        // Extract product IDs from the data array
        const productIds = data.map(product => product.id);
        console.log("Product IDs:", productIds);
        
        // Fetch details for each product ID
        this.fetchProductDetails(productIds);
      }
    }
  );
}
  fetchProductDetails(productIds: number[]): void {
    // Create an array to store the promises
    const productPromises = productIds.map(id => 
      this.productService.getProdByIdWithDiscount(id).toPromise()
    );

    // Wait for all promises to resolve
    Promise.all(productPromises)
      .then(products => {
        // Add view count to each product
      
        this.relatedProducts = products.map((product, index) => {
          
   
          return {
            ...product,
            
          };
        });
        
     console.log("tes",this.relatedProducts)
      })
      .catch(error => {
        console.error("Error fetching product details:", error);
      });
  }

  findViewCount(productId: number): number {
    
    // Get the statistics data again (or better: store it in a class property)
    const viewData = this.productService.getStaticsProduct();
    console.log("Most viewed products with details:", this.mostViewedProductss);
     
    // if (viewData && viewData.mostViewedProductss) {
    //   const productData = viewData.mostViewedProductss.find(item => item[0] === productId);
    //   return productData ? productData[1] : 0;
    // }
    
    return 0;
  }


  /**
   * Navigue vers la page d'un produit
   */
  navigateToProduct(productId: number): void {
    this.router.navigate(['/products', productId]);
  }

  

  quickView(productId: number): void {
      console.log('Navigation vers le produit:', productId);
    window.location.href = `/detailsClientsProd/${productId}`;
  }
  
}