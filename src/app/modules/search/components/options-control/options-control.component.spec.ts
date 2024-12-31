import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OptionsControlComponent } from './options-control.component';

describe('OptionsControlComponent', () => {
  let component: OptionsControlComponent;
  let fixture: ComponentFixture<OptionsControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OptionsControlComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OptionsControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
