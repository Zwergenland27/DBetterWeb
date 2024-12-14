import { Component } from '@angular/core';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatTooltip} from '@angular/material/tooltip';
import {MatIcon} from '@angular/material/icon';
import {AuthService} from './shared/services/auth.service';
import {MatFabAnchor} from '@angular/material/button';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatSidenavModule, MatTooltip, MatIcon, RouterLink, RouterLinkActive, MatFabAnchor],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'DBetter';

  constructor(public auth : AuthService) {}
}
