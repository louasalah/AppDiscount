import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailProdClientsComponent } from './detail-prod-clients.component';

describe('DetailProdClientsComponent', () => {
  let component: DetailProdClientsComponent;
  let fixture: ComponentFixture<DetailProdClientsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DetailProdClientsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailProdClientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
