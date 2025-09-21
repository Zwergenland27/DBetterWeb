import {Component, effect, input, output} from '@angular/core';

@Component({
  selector: 'toggle-button',
  imports: [],
  template: `
    <div class="toggle-button">
      @for(option of options(); track option){
        <button [class.active]="option.key == _selectedOption" (click)="onclick(option.key)">{{option.label}}</button>
      }
    </div>
  `,
  styleUrl: './toggle-button.component.scss'
})
export class ToggleButtonComponent<T> {
  options = input.required<{key:T, label: string}[]>();
  selectedOption = input.required<T>();
  selectedOptionChange = output<T>();

  _selectedOption: T | undefined = undefined;

  constructor() {
    effect(() => {
      this._selectedOption = this.selectedOption();
    });
  }

  onclick(key: T){
    this._selectedOption = key;
    this.selectedOptionChange.emit(key);
  }
}
