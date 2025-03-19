import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TracageStatisticsComponent } from './tracage-statistics.component';

describe('TracageStatisticsComponent', () => {
  let component: TracageStatisticsComponent;
  let fixture: ComponentFixture<TracageStatisticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TracageStatisticsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TracageStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
