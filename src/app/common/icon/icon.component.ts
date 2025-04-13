import {Component, input} from '@angular/core';

@Component({
  selector: 'icon',
  imports: [],
  template: `
    <span class="material-symbols-outlined">{{name()}}</span>
  `,
  styles: `
  span {
    user-select: none;
    display: flex;
    justify-content: center;
    font-size: 1.5rem;
  }`
})
export class IconComponent {
  name = input.required<string>();
}
