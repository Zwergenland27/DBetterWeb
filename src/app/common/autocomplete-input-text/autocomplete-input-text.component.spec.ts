import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutocompleteInputTextComponent } from './autocomplete-input-text.component';

describe('AutocompleteInputTextComponent', () => {
  let component: AutocompleteInputTextComponent;
  let fixture: ComponentFixture<AutocompleteInputTextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AutocompleteInputTextComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AutocompleteInputTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
