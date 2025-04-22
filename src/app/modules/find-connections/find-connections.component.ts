import { Component } from '@angular/core';
import {RouteOptionsComponent} from './components/route-options/route-options.component';
import {ExpansionPanelComponent} from './components/expansion-panel/expansion-panel.component';
import {TimeOptionsComponent} from './components/time-options/time-options.component';
import {PassengerOptionsComponent} from './components/passenger-options/passenger-options.component';
import {FloatingButtonComponent} from '../../common/floating-button/floating-button.component';
import {IconComponent} from '../../common/icon/icon.component';
import {ConnectionsData, newRequest} from './connections-data';

@Component({
  selector: 'app-find-connections',
  imports: [
    RouteOptionsComponent,
    ExpansionPanelComponent,
    TimeOptionsComponent,
    PassengerOptionsComponent,
    FloatingButtonComponent,
    IconComponent
  ],
  templateUrl: './find-connections.component.html',
  styleUrl: './find-connections.component.scss'
})
export class FindConnectionsComponent {
  editMode = true;

  connectionOptions = newRequest();

  close(){
    this.editMode = false;
  }

  open(){
    this.editMode = true;
  }
}
