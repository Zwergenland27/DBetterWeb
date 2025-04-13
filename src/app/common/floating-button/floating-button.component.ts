import {booleanAttribute, Component, input} from '@angular/core';
import {IconComponent} from '../icon/icon.component';
import {NgIf} from '@angular/common';

@Component({
  selector: 'floating-button',
  imports: [
    IconComponent,
    NgIf
  ],
  template: `
    <button [disabled]="disabled()">
      <icon *ngIf="icon()" [name]="icon()!"/>
      <span>{{ text() }}</span>
    </button>
  `,
  styleUrl: './floating-button.component.scss'
})
export class FloatingButtonComponent {
  icon = input<string>();
  text = input.required<string>();
  disabled = input(false, {transform: booleanAttribute});
}
