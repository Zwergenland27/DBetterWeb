import {booleanAttribute, Component, input, output} from '@angular/core';
import {IconComponent} from '../icon/icon.component';

@Component({
  selector: 'icon-button-mini',
  imports: [
    IconComponent
  ],
  template: `
    <button (click)="buttonClick.emit()">
      <span></span>
      <icon [class.highlight]="highlight()" [name]="icon()"/>
    </button>
  `,
  styleUrl: './icon-button-mini.component.scss'
})
export class IconButtonMiniComponent {
  icon = input.required<string>();
  buttonClick = output();
  highlight = input(false, {transform: booleanAttribute});
}
