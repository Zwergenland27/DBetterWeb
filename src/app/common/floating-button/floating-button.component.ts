import {booleanAttribute, Component, input} from '@angular/core';
import {IconComponent} from '../icon/icon.component';


@Component({
  selector: 'floating-button',
  imports: [
    IconComponent
],
  template: `
    <button [disabled]="disabled() || loading()" [class.small]="small()" [class.secondary]="secondary()">
      @if (icon() && !loading()) {
        <icon [name]="icon()!"/>
      }
      @if (loading()) {
        <div class="spinner"></div>
      }
      @if (text()) {
        <span>{{ text() }}</span>
      }
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
  loading = input(false, {transform: booleanAttribute});
}
