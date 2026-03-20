import {Component, input} from '@angular/core';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {IconComponent} from '../icon/icon.component';

@Component({
  selector: 'nav-button',
  imports: [
    RouterLink,
    IconComponent,
    RouterLinkActive
  ],
  template: `
    <a [routerLink]="link()" routerLinkActive="active">
      <icon [name]="icon()"/>
      <span>{{text()}}</span>
    </a>
  `,
  styleUrl: './nav-button.component.scss'
})
export class NavButtonComponent {
  icon = input.required<string>();
  link = input.required<string>();
  text = input.required<string>();
}
