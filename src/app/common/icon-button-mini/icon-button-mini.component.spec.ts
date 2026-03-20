import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconButtonMiniComponent } from './icon-button-mini.component';

describe('IconButtonMiniComponent', () => {
  let component: IconButtonMiniComponent;
  let fixture: ComponentFixture<IconButtonMiniComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconButtonMiniComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IconButtonMiniComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
