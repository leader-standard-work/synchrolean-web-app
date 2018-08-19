import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MetricsBannerComponent } from './metrics-banner.component';

describe('MetricsBannerComponent', () => {
  let component: MetricsBannerComponent;
  let fixture: ComponentFixture<MetricsBannerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MetricsBannerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MetricsBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
