import {Component, input} from '@angular/core';

@Component({
  selector: 'icon',
  imports: [],
  template: `
    <span class="material-symbols-outlined">{{name()}}</span>
  `,
  styles: `
  span {
    display: flex;
  }`
})
export class IconComponent {
  name = input.required<string>();
}
