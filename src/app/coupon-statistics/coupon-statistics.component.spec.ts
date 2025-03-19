import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CouponStatisticsComponent } from './coupon-statistics.component';

describe('CouponStatisticsComponent', () => {
  let component: CouponStatisticsComponent;
  let fixture: ComponentFixture<CouponStatisticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CouponStatisticsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CouponStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
