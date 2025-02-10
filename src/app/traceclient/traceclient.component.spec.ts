import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TraceclientComponent } from './traceclient.component';

describe('TraceclientComponent', () => {
  let component: TraceclientComponent;
  let fixture: ComponentFixture<TraceclientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TraceclientComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TraceclientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
