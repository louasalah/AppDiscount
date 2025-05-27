import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SmartphonesComponent } from './smartphones/smartphones.component';
import { ServicesInternetComponent } from './services-internet/services-internet.component';
import { ProfileComponent } from './profile/profile.component';
import { TraceclientComponent } from './traceclient/traceclient.component';
import { HomeComponent } from './home/home.component';
import { ProductAdminComponent } from './product-admin/product-admin.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DiscountDefAdminComponent } from './discount-def-admin/discount-def-admin.component';
import { LinkDiscProductComponent } from './link-disc-product/link-disc-product.component';
import { EditDiscountComponent } from './edit-discount/edit-discount.component';
import { EditProduitComponent } from './edit-produit/edit-produit.component';
import { EditHolidaysComponent } from './edit-holidays/edit-holidays.component';
import { HolidaysComponent } from './holidays/holidays.component';
import { AjoutDiscountComponent } from './ajout-discount/ajout-discount.component';
import { ClientsComponent } from './clients/clients.component';
import { ProductClientsComponent } from './product-clients/product-clients.component';
import { DetailProdClientsComponent } from './detail-prod-clients/detail-prod-clients.component';
import { AccessoiresComponent } from './accessoires/accessoires.component';
import { CoupontracageComponent } from './coupontracage/coupontracage.component';
import { CouponStatisticsComponent } from './coupon-statistics/coupon-statistics.component';
import { TracageStatisticsComponent } from './tracage-statistics/tracage-statistics.component';
const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'products/category/:nom', component: SmartphonesComponent },
  { path: 'products/category/:nom', component: AccessoiresComponent },
  { path: 'products/category/:nom', component: ServicesInternetComponent },  
  { path: 'profile', component: ProfileComponent },
  { path: 'Aboutus', component:ClientsComponent} ,
  { path: 'clientsprod', component:ProductClientsComponent} ,
  { path: 'detailsClientsProd/:idproduct', component:DetailProdClientsComponent} ,
 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

