import {Component, input} from '@angular/core';

@Component({
  selector: 'input-checkbox',
  imports: [],
  template: `
    <div class="input">
      <input [id]="inputId" type="checkbox"/>
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
  label = input.required<string>();
  inputId = 'input-' + crypto.randomUUID();
}
