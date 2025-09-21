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
    input {
      accent-color: var(--primary);
      font: var(--title-large);
    }
  `
})
export class InputCheckboxComponent {
  label = input.required<string>();
  inputId = 'input-' + crypto.randomUUID();
}
