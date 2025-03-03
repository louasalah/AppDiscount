import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SmartphonesComponent } from './smartphones/smartphones.component';
import { ForfaitsMobilesComponent } from './forfaits-mobiles/forfaits-mobiles.component';
import { ServicesInternetComponent } from './services-internet/services-internet.component';
import { ProfileComponent } from './profile/profile.component';
import { SignupComponent } from './signup/signup.component';
import { SigninComponent } from './signin/signin.component';
import { TraceclientComponent } from './traceclient/traceclient.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './home/home.component';
import { ProductAdminComponent } from './product-admin/product-admin.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DiscountDefAdminComponent } from './discount-def-admin/discount-def-admin.component';
import { LinkDiscProductComponent } from './link-disc-product/link-disc-product.component';
import { EditDiscountComponent } from './edit-discount/edit-discount.component';
import { EditProduitComponent } from './edit-produit/edit-produit.component';
import { HolidaysComponent } from './holidays/holidays.component';
import { EditHolidaysComponent } from './edit-holidays/edit-holidays.component';
import { AjoutDiscountComponent } from './ajout-discount/ajout-discount.component';
import { HttpClientModule, provideHttpClient, withFetch } from '@angular/common/http';
import { ClientsComponent } from './clients/clients.component';
import { ProductClientsComponent } from './product-clients/product-clients.component';
import { DetailProdClientsComponent } from './detail-prod-clients/detail-prod-clients.component';




@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    SmartphonesComponent,
    ForfaitsMobilesComponent,
    ServicesInternetComponent,
    ProfileComponent,
    SignupComponent,
    SigninComponent,
    TraceclientComponent,
    HomeComponent,
    ProductAdminComponent,
    DashboardComponent,
    DiscountDefAdminComponent,
    LinkDiscProductComponent,
    EditDiscountComponent,
    EditProduitComponent,
    HolidaysComponent,
    EditHolidaysComponent,
    AjoutDiscountComponent,
    ClientsComponent,
    ProductClientsComponent,
    DetailProdClientsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
  ],
  providers: [
    /*
    provideHttpClient(withFetch()),
  */
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
