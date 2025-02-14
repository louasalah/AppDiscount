import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjoutDiscountComponent } from './ajout-discount.component';

describe('AjoutDiscountComponent', () => {
  let component: AjoutDiscountComponent;
  let fixture: ComponentFixture<AjoutDiscountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AjoutDiscountComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AjoutDiscountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
