import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RouteOptionsComponent } from './route-options.component';

describe('RouteSettingsComponent', () => {
  let component: RouteOptionsComponent;
  let fixture: ComponentFixture<RouteOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouteOptionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RouteOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
