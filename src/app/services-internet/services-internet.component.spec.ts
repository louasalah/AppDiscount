import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicesInternetComponent } from './services-internet.component';

describe('ServicesInternetComponent', () => {
  let component: ServicesInternetComponent;
  let fixture: ComponentFixture<ServicesInternetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ServicesInternetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServicesInternetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
