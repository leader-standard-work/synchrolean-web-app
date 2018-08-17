import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamMetricsComponent } from './team-metrics.component';

describe('TeamMetricsComponent', () => {
  let component: TeamMetricsComponent;
  let fixture: ComponentFixture<TeamMetricsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeamMetricsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamMetricsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
