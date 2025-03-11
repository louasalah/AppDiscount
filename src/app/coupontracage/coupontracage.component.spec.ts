import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoupontracageComponent } from './coupontracage.component';

describe('CoupontracageComponent', () => {
  let component: CoupontracageComponent;
  let fixture: ComponentFixture<CoupontracageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CoupontracageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoupontracageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
