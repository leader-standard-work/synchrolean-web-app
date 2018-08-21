import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RollupComponent } from './rollup.component';

describe('RollupComponent', () => {
  let component: RollupComponent;
  let fixture: ComponentFixture<RollupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RollupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RollupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
