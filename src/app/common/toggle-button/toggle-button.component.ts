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
export class ToggleButtonComponent {
  options = input.required<{key:string, label: string}[]>();
  selectedOption = input.required<string>();
  selectedOptionChange = output<string>();

  _selectedOption = '';

  constructor() {
    effect(() => {
      this._selectedOption = this.selectedOption();
    });
  }

  onclick(key: string){
    this._selectedOption = key;
    this.selectedOptionChange.emit(key);
  }
}
