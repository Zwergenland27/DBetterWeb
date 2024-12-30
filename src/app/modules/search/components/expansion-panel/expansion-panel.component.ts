import {Component, Input} from '@angular/core';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'app-expansion-panel',
  imports: [
    MatIcon
  ],
  templateUrl: './expansion-panel.component.html',
  styleUrl: './expansion-panel.component.css'
})
export class ExpansionPanelComponent {
  @Input() expanded = false;
  @Input() warn = false;

  togglePanel(){
    this.expanded = !this.expanded
  }
}
