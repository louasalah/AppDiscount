import { Component, OnInit, OnDestroy, PLATFORM_ID, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { interval, Subscription } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
import { ProductService, ProductWithDiscountDTO } from '../product.service';
import Swal from 'sweetalert2';
import { CouponService } from '../coupon.service';

interface Category {
  id_category: number;
  nom: string;
  itemCount?: number;
  imageUrl?: string;
}

interface Product {
  idproduct: number;
  description: string;
  price: number;
  image: string;
  referenceProduct: string;
  categorie: Category;
  linkProdDiscs?: Array<{
    discountedPrice: number;
    valideTo: string;
  }>;
  inWishlist?: boolean;
  badge?: string;
  rating?: number;
  reviewCount?: number;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
    specialOfferProduct: any = null; // Pour stocker la remise de 50% la plus récente

    
  // Hero carousel data
  heroSlides = [
    {
      title: 'Découvrez nos offres exclusives',
      description: 'Profitez de nos meilleures offres sur les smartphones',
      buttonText: 'Acheter maintenant',
      imageUrl: 'https://ruedelhygiene.fr/wp-content/uploads/2023/07/site-codes-promos.png'
    },
    {
      title: 'Nouveaux accessoires',
      description: 'Découvrez notre collection d\'accessoires tendance',
      buttonText: 'Voir la collection',
      imageUrl: 'https://cdn.shopify.com/s/files/1/0554/1281/8100/files/202301_Promos10.jpg?v=1675761410'
    },
    
 
   
    // Add more slides as needed
  ];
  currentSlide = 0;
  
  // Featured categories
  featuredCategories: Category[] = [];
  
  // Product tabs
  productTabs: string[] = [];
  activeTab = 0;
  
  // Products data
  allProducts: Product[] = [];
    remizeProduct: any;
  // Filtered products based on active tab
  filteredProducts: Product[] = [];
  
  // New arrivals
  newArrivals: Product[] = [];
  
  // Special offer
  specialOfferImage = 'https://www.orange.tn/_next/image?url=%2Fimages%2Fgraphics%2Fmaxit-app-screenshot.png&w=1920&q=75';
  countdown = { days: 3, hours: 8, minutes: 45, seconds: 30 };
  private countdownSubscription: Subscription | null = null;
  
  // Benefits
  benefits = [
    { icon: 'fas fa-undo', title: 'Promotions exclusives', description: 'réductions exceptionnelles sur une large gamme des smartphones,des accessoires et des services internets',  img: 'https://img.icons8.com/fluency/96/discount--v1.png'},
    { icon: 'fas fa-truck', title: 'Retrait en boutique simplifié', description: 'Votre coupon est valable 24h (ou 48h le week-end) et à présenter en boutique',img: "https://img.icons8.com/clouds/100/shop.png"},
    { icon: 'fas fa-lock', title: 'Coupon garanti', description: 'Générez votre coupon en ligne et bénéficiez d’une remise en boutique' ,img:"https://img.icons8.com/color/96/approval--v1.png"},
    
  ];
  
 
  clientReviews = [
    {
      quote: 'Excellente expérience, tout est rapide et facile !',
      content: 'La meilleure offre télécom que j\'ai trouvée. Très satisfaits !',
      author: 'Admin1',
      role: 'Client fidèle',
      stars: '⭐⭐⭐⭐⭐'
    },
    {
      quote: 'Service client très réactif et toujours disponible.',
      content: 'Le service client est toujours à l\'écoute, ce qui rend l\'expérience encore plus agréable.',
      author: 'Admin2',
      role: 'Nouvelle Cliente',
      stars: '⭐⭐⭐⭐⭐'
    },
    {
      quote: 'Un service client réactif et des remises qui m\'ont permis de faire de belles économies.',
      content: 'Le service client est rapide, facilité d\'accès',
      author: 'Admin3',
      role: 'Client satisfait',
      stars: '⭐⭐⭐⭐⭐'
    }
  ];
  
    // Key figures section
    keyFigures = [
      {
        value: '24',
        description: 'Pays d\'Innovation'
      },
      {
        value: '7M€',
        description: 'Investis en R&D'
      },
      {
        value: '400',
        description: 'Projets accompagnés'
      }
    ];
  // Newsletter
  newsletterEmail = '';
  newsletterConsent = false;
  
  // Flag to indicate if code is running in browser
  isBrowser: boolean;
  
  // Loading states
  loadingCategories = true;
  loadingProducts = true;

  constructor(
    private couponService: CouponService,

    private router: Router,
    private productService: ProductService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }
ngOnInit(): void {
  // Load categories and products
  this.loadCategories();
  this.remisePRoduct();


  // Assurez-vous que les dates existent et sont bien des Date
  if (this.remizeProduct?.valideFrom && this.remizeProduct?.valideTo) {
    const fromDate = new Date(this.remizeProduct.valideFrom);
    const toDate = new Date(this.remizeProduct.valideTo);

    const diffTime = Math.abs(toDate.getTime() - fromDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    console.log('Différence en jours :', diffDays);

    // Initialiser ou mettre à jour le countdown avec les jours calculés
    this.countdown = {
      days: diffDays,
      hours: 0,
      minutes: 0,
      seconds: 0
    };
  } 

  // Only start countdown and carousel if in browser
  if (this.isBrowser) {
    this.startCountdown();
    this.startCarouselAutoplay();
  }
}
initCountdown(): void {
  if (this.remizeProduct?.valideFrom && this.remizeProduct?.valideTo) {
    const fromDate = new Date(this.remizeProduct.valideFrom);
    const toDate = new Date(this.remizeProduct.valideTo);

    const diffTime = Math.abs(toDate.getTime() - fromDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    this.countdown = {
      days: diffDays,
      hours: 0,
      minutes: 0,
      seconds: 0
    };
  } else {
    this.countdown = { days: 3, hours: 8, minutes: 45, seconds: 30 };
  }
}


  ngOnDestroy(): void {
    // Clean up subscriptions
    if (this.countdownSubscription) {
      this.countdownSubscription.unsubscribe();
    }
    
    if (this.carouselSubscription) {
      this.carouselSubscription.unsubscribe();
    }
  }
  
  // Data loading methods
  loadCategories(): void {
    this.loadingCategories = true;
    this.productService.getCategory().subscribe(
      (categories) => {
        // Set featured categories
        this.featuredCategories = categories.map(category => ({
          ...category,
          itemCount: Math.floor(Math.random() * 200) + 50, // Mock item count
          imageUrl: `assets/images/category-${category.nom.toLowerCase()}.jpg`
        }));
        
        // Set product tabs
        this.productTabs = ['Tous', ...categories.map(cat => cat.nom)];
        
        this.loadingCategories = false;
        
        // Load products after categories are loaded
        this.loadProducts();
      },
      (error) => {
        console.error('Error loading categories:', error);
        this.loadingCategories = false;
      }
    );
  }
  
  loadProducts(): void {
    this.loadingProducts = true;
    
    // Load all products for initial display
    this.productService.getProductsAdmin().subscribe(
      (products) => {
        this.allProducts = products.map(product => this.processProduct(product));
        
        // Set new arrivals (just sample the first few products for this demo)
        this.newArrivals = this.allProducts.slice(0, 4);
        
        this.filterProducts();
        this.loadingProducts = false;
      },
      (error) => {
        console.error('Error loading products:', error);
        this.loadingProducts = false;
      }
    );
  }

  
  // Process product to add UI-specific properties
  processProduct(product: any): Product {
    const processed: Product = {
      ...product,
      inWishlist: false,
      rating: Math.floor(Math.random() * 5) + 1, // Mock rating
      reviewCount: Math.floor(Math.random() * 100) + 10, // Mock review count
    };
    
    // Calculate discount badge if available
    if (product.linkProdDiscs && product.linkProdDiscs.length > 0) {
      // Find active discount
      const activeDiscount = product.linkProdDiscs.find((link: any) => 
        link.active && new Date(link.valideTo) > new Date()
      );
      
      if (activeDiscount) {
        const discountPercentage = Math.round(
          ((product.price - activeDiscount.discountedPrice) / product.price) * 100
        );
        processed.badge = `-${discountPercentage}%`;
      }
    }
    
    return processed;
  }
   remisePRoduct (): void{
   
    this.productService.getRemiseProduct().subscribe(
      (products) => {
        this.remizeProduct = products
            this.initCountdown(); // Appel ici, après chargement

        // Set new arrivals (just sample the first few products for this demo)
  
      },
      (error) => {
        console.error('Error loading products:', error);
        this.loadingProducts = false;
      }
    );
  }


  // Carousel methods
  private carouselSubscription: Subscription | null = null;
  
  startCarouselAutoplay(): void {
    if (this.isBrowser) {
      this.carouselSubscription = interval(5000).subscribe(() => {
        this.nextSlide();
      });
    }
  }

  nextSlide(): void {
    this.currentSlide = (this.currentSlide + 1) % this.heroSlides.length;
  }

  prevSlide(): void {
    this.currentSlide = (this.currentSlide - 1 + this.heroSlides.length) % this.heroSlides.length;
  }

  setCurrentSlide(index: number): void {
    this.currentSlide = index;
  }

  // Product methods
  setActiveTab(index: number): void {
    this.activeTab = index;
    this.filterProducts();
  }
filterProducts(): void {
  if (this.activeTab === 0) {
    // Show all products but limit to 6
    this.filteredProducts = this.allProducts.slice(0, 6);
  } else {
    // Filter by category and limit to 6
    const categoryName = this.productTabs[this.activeTab];
    this.filteredProducts = this.allProducts
      .filter(product => product.categorie.nom === categoryName)
      .slice(0, 6);
  }
}

  // Gets the current price considering any active discounts
  getCurrentPrice(product: Product): number {
    if (product.linkProdDiscs && product.linkProdDiscs.length > 0) {
      const activeDiscount = product.linkProdDiscs.find(link => 
        link.valideTo && new Date(link.valideTo) > new Date()
      );
      
      if (activeDiscount) {
        return activeDiscount.discountedPrice;
      }
    }
    return product.price;
  }

  // Gets the original price for display
  getOriginalPrice(product: Product): number | null {
    if (product.linkProdDiscs && product.linkProdDiscs.length > 0) {
      const activeDiscount = product.linkProdDiscs.find(link => 
        link.valideTo && new Date(link.valideTo) > new Date()
      );
      
      if (activeDiscount) {
        return product.price;
      }
    }
    return null;
  }

  quickView(productId: number): void {
    this.router.navigate(['/detailsClientsProd', productId]);
   
    console.log('Quick view for product', productId);
  }

  addToCart(productId: number): void {
    // Implement add to cart functionality
    console.log('Add to cart', productId);
  }

  toggleWishlist(productId: number): void {
    // Update wishlist status in allProducts
    const product = this.allProducts.find(p => p.idproduct === productId);
    if (product) {
      product.inWishlist = !product.inWishlist;
    }
    
    // Also update in new arrivals
    const newArrival = this.newArrivals.find(p => p.idproduct === productId);
    if (newArrival) {
      newArrival.inWishlist = !newArrival.inWishlist;
    }
    
    // Update in filtered products as well
    const filteredProduct = this.filteredProducts.find(p => p.idproduct === productId);
    if (filteredProduct) {
      filteredProduct.inWishlist = !filteredProduct.inWishlist;
    }
  }

  // Navigation methods
  navigateToShop(): void {
    this.router.navigate(['/shop']);
  }

  navigateToCategory(categoryId: number): void {
    this.router.navigate(['/category', categoryId]);
  }

  navigateToProductDetail(productId: number): void {
    this.router.navigate(['/product', productId]);
  }

  navigateToAllProducts(): void {
    this.router.navigate(['/clientsprod']);
  }

  // Navigation vers l'offre spéciale ou la page des produits
  navigateToSpecialOffer(): void {
    if (this.specialOfferProduct && this.specialOfferProduct.product) {
      // Si une offre spéciale est disponible, naviguer vers la page détail du produit
      this.router.navigate(['/detailsClientsProd', this.specialOfferProduct.product.id]);
    } else {
      // Sinon, naviguer vers la page générale des produits
      this.router.navigate(['/clientsprod']);
    }
  }

  // Countdown timer
  startCountdown(): void {
    if (this.isBrowser) {
      this.countdownSubscription = interval(1000).pipe(
        takeWhile(() => this.countdown.days > 0 || this.countdown.hours > 0 || 
                     this.countdown.minutes > 0 || this.countdown.seconds > 0)
      ).subscribe(() => {
        this.updateCountdown();
      });
    }
  }

  updateCountdown(): void {
    if (this.countdown.seconds > 0) {
      this.countdown.seconds--;
    } else {
      this.countdown.seconds = 59;
      
      if (this.countdown.minutes > 0) {
        this.countdown.minutes--;
      } else {
        this.countdown.minutes = 59;
        
        if (this.countdown.hours > 0) {
          this.countdown.hours--;
        } else {
          this.countdown.hours = 23;
          this.countdown.days--;
        }
      }
    }
  }



   getCoupon(productId: number) {
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
          this.DemandeCouponEmail(result.value,productId);
        }
      });
    }
  
    DemandeCouponEmail(email: string,proId:number) {
    
      this.couponService.DemandeCouponEmail(email,proId).subscribe(
        (response) => {
          Swal.fire('Succès', 'Le coupon a été envoyé avec succès !', 'success');
        },
        (error) => {
          console.log(error.error)
          Swal.fire('Erreur', error.error);
        }
      );
    }
}