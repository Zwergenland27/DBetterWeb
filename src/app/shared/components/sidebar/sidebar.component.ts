import { Component } from '@angular/core';
import {MatListItem, MatNavList} from '@angular/material/list';
import {MatIcon} from '@angular/material/icon';
import {NgForOf} from '@angular/common';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {MatTooltip} from '@angular/material/tooltip';
export type MenuItem = {
  icon: string;
  label: string;
  route: string;
}
@Component({
  selector: 'app-sidebar',
  imports: [
    MatNavList,
    MatIcon,
    NgForOf,
    RouterLink,
    MatTooltip,
    MatListItem,
    RouterLinkActive
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  genericMenu:MenuItem[] = [
    {
      icon: 'home',
      label: 'Home',
      route: 'home'
    }
  ]

  userMenu:MenuItem[] = [
    {
      icon: 'person',
      label: 'Account',
      route: 'account'
    }
  ]
}
