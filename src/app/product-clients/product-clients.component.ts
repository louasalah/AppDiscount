import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../product.service';
import { CouponService } from '../coupon.service';
import Swal from 'sweetalert2';

interface Category {
  id_category: number;
  nom: string;
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
  selector: 'app-product-clients',
  templateUrl: './product-clients.component.html',
  styleUrls: ['./product-clients.component.css']
})
export class ProductClientsComponent implements OnInit {
  // Products data
  allProducts: Product[] = [];
  displayedProducts: Product[] = [];
  
  // Categories data
  categories: Category[] = [];
  
  // Filter states
  selectedCategory: number | null = null;
  searchTerm = '';
  priceRange = { min: 0, max: 1000 };
  sortOption = 'newest';
  
  // Pagination
  currentPage = 1;
  itemsPerPage = 12;
  totalPages = 1;
  
  // UI states
  loadingProducts = true;
  showFilters = false;
  isScrolled = false;
  
  constructor(
    private router: Router,
    private productService: ProductService,
    private couponService: CouponService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadProducts();
  }
  
  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 100;
  }
  
  // Data loading methods
  loadCategories(): void {
    this.productService.getCategory().subscribe(
      (categories) => {
        this.categories = categories;
      },
      (error) => {
        console.error('Error loading categories:', error);
      }
    );
  }
  
  loadProducts(): void {
    this.loadingProducts = true;
    
    this.productService.getProductsAdmin().subscribe(
      (products) => {
        this.allProducts = products.map(product => this.processProduct(product));
        this.applyFilters();
        this.loadingProducts = false;
      },
      (error) => {
        console.error('Error loading products:', error);
        this.loadingProducts = false;
      }
    );
  }
  
  // Processing products
  processProduct(product: any): Product {
    return {
      ...product,
      inWishlist: false, // Set initial wishlist state
      badge: this.getProductBadge(product),
      rating: Math.floor(Math.random() * 2) + 4, // Mock rating between 4-5
      reviewCount: Math.floor(Math.random() * 100) + 10, // Mock review count
    };
  }
  
  getProductBadge(product: any): string | undefined {
    // Check if product has a discount
    if (product.linkProdDiscs && product.linkProdDiscs.length > 0) {
      const validDiscount = product.linkProdDiscs.find((disc: any) => 
        new Date(disc.valideTo) > new Date());
        
      if (validDiscount) {
        const discountPercentage = Math.round(
          ((product.price - validDiscount.discountedPrice) / product.price) * 100
        );
        if (discountPercentage >= 20) {
          return `-${discountPercentage}%`;
        }
      }
    }
    
    // Check if product is new (mock logic)
    if (product.idproduct % 7 === 0) { // Just a way to randomly assign "New" badge
      return 'Nouveau';
    }
    
    return undefined;
  }
  
  // Filter and sort methods
  applyFilters(): void {
    let filtered = [...this.allProducts];
    
    // Apply category filter
    if (this.selectedCategory !== null) {
      filtered = filtered.filter(product => 
        product.categorie.id_category === this.selectedCategory);
    }
    
    // Apply search term
    if (this.searchTerm.trim()) {
      const searchLower = this.searchTerm.toLowerCase();
      filtered = filtered.filter(product => 
        product.description.toLowerCase().includes(searchLower) ||
        product.referenceProduct.toLowerCase().includes(searchLower)
      );
    }
    
    // Apply price range
    filtered = filtered.filter(product => {
      const currentPrice = this.getCurrentPrice(product);
      return currentPrice >= this.priceRange.min && currentPrice <= this.priceRange.max;
    });
    
    // Apply sorting
    switch (this.sortOption) {
      case 'price-low':
        filtered.sort((a, b) => this.getCurrentPrice(a) - this.getCurrentPrice(b));
        break;
      case 'price-high':
        filtered.sort((a, b) => this.getCurrentPrice(b) - this.getCurrentPrice(a));
        break;
      case 'name':
        filtered.sort((a, b) => a.description.localeCompare(b.description));
        break;
      case 'newest':
        // For demo, we'll just sort by ID (assuming higher ID = newer)
        filtered.sort((a, b) => b.idproduct - a.idproduct);
        break;
    }
    
    // Update total pages
    this.totalPages = Math.ceil(filtered.length / this.itemsPerPage);
    
    // Apply pagination
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.displayedProducts = filtered.slice(startIndex, startIndex + this.itemsPerPage);
  }
  
  // Price calculation methods
  getOriginalPrice(product: Product): number | null {
    if (product.linkProdDiscs && product.linkProdDiscs.length > 0) {
      const validDiscount = product.linkProdDiscs.find(disc => 
        new Date(disc.valideTo) > new Date());
        
      if (validDiscount) {
        return product.price;
      }
    }
    return null;
  }
  
  getCurrentPrice(product: Product): number {
    if (product.linkProdDiscs && product.linkProdDiscs.length > 0) {
      const validDiscount = product.linkProdDiscs.find(disc => 
        new Date(disc.valideTo) > new Date());
        
      if (validDiscount) {
        return validDiscount.discountedPrice;
      }
    }
    return product.price;
  }
  
  // User actions
  setCategory(categoryId: number | null): void {
    this.selectedCategory = categoryId;
    this.currentPage = 1;
    this.applyFilters();
  }
  
  setPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.applyFilters();
  }
  
  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }
  
  resetFilters(): void {
    this.selectedCategory = null;
    this.searchTerm = '';
    this.priceRange = { min: 0, max: 1000 };
    this.sortOption = 'newest';
    this.currentPage = 1;
    this.applyFilters();
  }
  
  onSearchChange(): void {
    this.currentPage = 1;
    this.applyFilters();
  }
  
  onSortChange(event: Event): void {
    this.sortOption = (event.target as HTMLSelectElement).value;
    this.currentPage = 1;
    this.applyFilters();
  }
  
  // Product actions
  toggleWishlist(productId: number): void {
    const product = this.allProducts.find(p => p.idproduct === productId);
    if (product) {
      product.inWishlist = !product.inWishlist;
    }
  }
  


  quickView(productId: number): void {
    this.router.navigate(['/detailsClientsProd', productId]);
   
    console.log('Quick view for product', productId);
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
  // Helper methods
  getPageRange(): number[] {
    const range = [];
    const maxPagesToShow = 5;
    
    let startPage = Math.max(1, this.currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(this.totalPages, startPage + maxPagesToShow - 1);
    
    // Adjust start page if end page is capped
    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      range.push(i);
    }
    
    return range;
  }
  
  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }



  
 

}