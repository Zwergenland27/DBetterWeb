import {Component, OnInit} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {NavButtonComponent} from './common/nav-button/nav-button.component';
import {IconComponent} from './common/icon/icon.component';
import {FloatingButtonComponent} from './common/floating-button/floating-button.component';
import {environment} from '../environments/environment';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavButtonComponent, IconComponent, FloatingButtonComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {

  ngOnInit() {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = environment.fontUrl;
    document.head.appendChild(link);
  }

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
