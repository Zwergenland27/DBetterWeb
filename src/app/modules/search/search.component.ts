import { Component } from '@angular/core';
import {ConfiguratorComponent} from './components/configurator/configurator.component';

@Component({
  selector: 'app-search',
  imports: [
    ConfiguratorComponent
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent {

}
