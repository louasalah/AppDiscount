import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscountDefAdminComponent } from './discount-def-admin.component';

describe('DiscountDefAdminComponent', () => {
  let component: DiscountDefAdminComponent;
  let fixture: ComponentFixture<DiscountDefAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DiscountDefAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiscountDefAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
