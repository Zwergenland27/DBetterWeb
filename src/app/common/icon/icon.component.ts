import {booleanAttribute, Component, effect, input} from '@angular/core';

@Component({
  selector: 'icon',
  imports: [],
  template: `
    <span class="material-symbols-outlined" [class.filled]="filled">{{realName}}</span>
  `,
  styles: `
    .filled {
      font-variation-settings: 'FILL' 1;
    }
    span {
      user-select: none;
      display: flex;
      justify-content: center;
      font-size: 1.5rem;
    }`
})
export class IconComponent {
  name = input.required<string>();
  realName = ''
  filled = false;

  constructor() {
    effect(() => {
      this.realName = this.name().replace('filled_', '');
      this.filled = this.name().startsWith('filled_');
    });
  }
}
