import {Component, computed} from '@angular/core';
import {SettingsService} from './settings.service';
import {AppSettings} from './settings';

@Component({
  selector: 'app-settings',
  imports: [],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent {
  constructor(public settings: SettingsService) {
  }

  toggle(event: Event){
    const checked = (event.target as HTMLInputElement).checked;
    this.settings.update({developerMode: checked});
  }
}
