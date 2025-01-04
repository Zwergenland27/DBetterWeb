import {Component, Input} from '@angular/core';
import {Demand} from '../../search.service';
import {MatIcon} from '@angular/material/icon';
import {MatTooltip} from '@angular/material/tooltip';

@Component({
  selector: 'app-demand',
  imports: [
    MatIcon,
    MatTooltip
  ],
  templateUrl: './demand.component.html',
  styleUrl: './demand.component.css'
})
export class DemandComponent {
  @Input({required:true}) showClass! : 'First' | 'Second';
  @Input({required: true}) demand!: Demand;
}
