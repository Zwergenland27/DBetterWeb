import {booleanAttribute, Component, input} from '@angular/core';
import {TransportSegmentDto} from '../../contracts/dtos/transport-segment.dto';
import {DatePipe, NgClass, NgIf} from '@angular/common';
import {IconComponent} from '../../../../common/icon/icon.component';
import {getDelayInformation} from '../../../../common/contracts/dtos/travel-time.dto';

@Component({
  selector: 'segment',
  imports: [
    NgIf,
    DatePipe,
    IconComponent,
    NgClass
  ],
  templateUrl: './segment.component.html',
  styleUrl: './segment.component.scss'
})

export class SegmentComponent {
  segment = input.required<TransportSegmentDto>();

  expanded = true;
  protected readonly getDelayInformation = getDelayInformation;
}
