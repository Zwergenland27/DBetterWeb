import {Component, input} from '@angular/core';
import {DatePipe, NgClass, NgIf} from '@angular/common';
import {IconComponent} from '../../../../common/icon/icon.component';
import {ComfortClass} from '../../../../common/contracts/dtos/comfort-class';
import {DemandDto, DemandStatus} from '../../../../common/contracts/dtos/demand';
import {TransportSegment} from '../../contracts/dtos/segment';

@Component({
  selector: 'segment',
  imports: [
    NgIf,
    DatePipe,
    NgClass,
    IconComponent
  ],
  templateUrl: './segment.component.html',
  styleUrl: './segment.component.scss'
})

export class SegmentComponent {
  segment = input.required<TransportSegment>();
  comfortClass = input.required<ComfortClass>();

  expanded = false;

  getDemand(index: number){
    let demand : DemandDto = {
      firstClass: DemandStatus.Unknown,
      secondClass: DemandStatus.Unknown,
    };

    if(!this.expanded){
      demand = this.segment().demand;
    }else if(index >= 0){
      demand = this.segment().stops[index].demand;
    }

    switch(this.comfortClass()){
      case ComfortClass.First: return demand.firstClass;
      case ComfortClass.Second: return demand.secondClass;
    }
  }

  toggleExpanded() {
    this.expanded = !this.expanded;
  }
}
