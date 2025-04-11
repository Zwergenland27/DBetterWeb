import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {IconComponent} from './common/icon/icon.component';
import {NavButtonComponent} from './common/nav-button/nav-button.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, IconComponent, NavButtonComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'DBetterWeb';
}
