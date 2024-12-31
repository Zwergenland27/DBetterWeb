import {Component, EventEmitter, Input, Output} from '@angular/core';
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
  @Output() expandedChange = new EventEmitter<boolean>();
  @Input() warn = false;

  togglePanel(){
    this.expanded = !this.expanded
    this.expandedChange.emit(this.expanded);
  }
}
