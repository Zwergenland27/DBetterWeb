import {Component, input, output} from '@angular/core';
import {IconComponent} from '../icon/icon.component';

@Component({
  selector: 'icon-button-mini',
  imports: [
    IconComponent
  ],
  template: `
    <button (click)="click.emit()">
      <span></span>
      <icon [name]="icon()"/>
    </button>
    `,
  styleUrl: './icon-button-mini.component.scss'
})
export class IconButtonMiniComponent {
  icon = input.required<string>();
  click = output();
}
