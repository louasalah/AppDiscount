import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductClientsComponent } from './product-clients.component';

describe('ProductClientsComponent', () => {
  let component: ProductClientsComponent;
  let fixture: ComponentFixture<ProductClientsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductClientsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductClientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
