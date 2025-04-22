import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {NavButtonComponent} from './common/nav-button/nav-button.component';
import {IconComponent} from './common/icon/icon.component';
import {FloatingButtonComponent} from './common/floating-button/floating-button.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavButtonComponent, IconComponent, FloatingButtonComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  navigationOpened = false;

  openNavigation(){
    window.scroll({
      top: 0
    });
    this.navigationOpened = true;
  }

  closeNavigation(){
    this.navigationOpened = false;
  }

  protected readonly open = open;
}
