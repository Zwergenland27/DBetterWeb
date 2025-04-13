import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {NavButtonComponent} from './common/nav-button/nav-button.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavButtonComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'DBetterWeb';
}
