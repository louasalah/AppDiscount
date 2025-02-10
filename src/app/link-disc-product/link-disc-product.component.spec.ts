import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkDiscProductComponent } from './link-disc-product.component';

describe('LinkDiscProductComponent', () => {
  let component: LinkDiscProductComponent;
  let fixture: ComponentFixture<LinkDiscProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LinkDiscProductComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LinkDiscProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
