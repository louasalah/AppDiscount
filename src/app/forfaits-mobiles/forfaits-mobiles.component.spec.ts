import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForfaitsMobilesComponent } from './forfaits-mobiles.component';

describe('ForfaitsMobilesComponent', () => {
  let component: ForfaitsMobilesComponent;
  let fixture: ComponentFixture<ForfaitsMobilesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ForfaitsMobilesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ForfaitsMobilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
