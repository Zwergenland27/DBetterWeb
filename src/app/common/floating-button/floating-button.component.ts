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
    <button [disabled]="disabled()" [class.small]="small()" [class.secondary]="secondary()">
      <icon *ngIf="icon()" [name]="icon()!"/>
      <span *ngIf="text()">{{ text() }}</span>
    </button>
  `,
  styleUrl: './floating-button.component.scss'
})
export class FloatingButtonComponent {
  icon = input<string>();
  text = input<string>();
  disabled = input(false, {transform: booleanAttribute});
  small = input(false, {transform: booleanAttribute});
  secondary = input(false, {transform: booleanAttribute});
}
