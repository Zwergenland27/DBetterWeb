import {Component, input, output} from '@angular/core';
import {IconButtonMiniComponent} from '../../../../common/icon-button-mini/icon-button-mini.component';

@Component({
  selector: 'segment-options',
  imports: [
    IconButtonMiniComponent,
  ],
  templateUrl: './segment-options.component.html',
  styleUrl: './segment-options.component.scss'
})
export class SegmentOptionsComponent {
  withButton = input<boolean>(true)
  addClick = output();
}
