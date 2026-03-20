import {Component, effect, input, output} from '@angular/core';

@Component({
  selector: 'input-checkbox',
  imports: [],
  template: `
    <div class="input">
      <input [id]="inputId" type="checkbox" [checked]="checked()" (change)="statusChange()"/>
      <label [for]="inputId">{{label()}}</label>
    </div>
  `,
  styles: `
    .input {
      display: flex;
    }
    input {
      accent-color: var(--primary);
    }
    label {
      font: var(--body-large);
      white-space: nowrap;
    }
  `
})
export class InputCheckboxComponent {
  checked = input.required<boolean>();
  checkedChange = output<boolean>();
  label = input.required<string>();
  inputId = 'input-' + crypto.randomUUID();

  currentlyChecked = false;

  constructor() {
    effect(() => {
      this.currentlyChecked = this.checked();
    });
  }

  statusChange() {
    this.currentlyChecked = !this.currentlyChecked;
    this.checkedChange.emit(this.currentlyChecked);
  }
}
