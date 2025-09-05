import {booleanAttribute, Component, effect, input, output} from '@angular/core';
import {IconComponent} from '../../../../common/icon/icon.component';


@Component({
  selector: 'expansion-panel',
  imports: [
    IconComponent
],
  templateUrl: './expansion-panel.component.html',
  styleUrl: './expansion-panel.component.scss'
})
export class ExpansionPanelComponent {
  text = input.required<string>();
  expanded = input(false, {transform: booleanAttribute});
  invalid = input.required<boolean>();
  invalidChange = output<boolean>();

  expandedChange = output<boolean>();

  isExpanded = false;

  constructor() {
    effect(() => {
      this.isExpanded = this.expanded()
    });
  }

  togglePanel(){
    this.isExpanded = !this.isExpanded;
    this.expandedChange.emit(this.isExpanded);
  }
}
