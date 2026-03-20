import {Component, input} from '@angular/core';
import { DatePipe, NgClass } from '@angular/common';
import {IconComponent} from '../../../../common/icon/icon.component';
import {ComfortClass} from '../../../../common/contracts/dtos/comfort-class';
import {DemandDto, DemandStatus} from '../../../../common/contracts/dtos/demand';
import {TransportSegment} from '../../contracts/dtos/segment';
import {FloatingButtonComponent} from '../../../../common/floating-button/floating-button.component';
import {Router} from '@angular/router';
import {SettingsService} from '../../../settings/settings.service';

@Component({
  selector: 'segment',
  imports: [
    DatePipe,
    NgClass,
    IconComponent,
    FloatingButtonComponent
  ],
  templateUrl: './segment.component.html',
  styleUrl: './segment.component.scss'
})

export class SegmentComponent {
  segment = input.required<TransportSegment>();
  comfortClass = input.required<ComfortClass>();

  expanded = false;

  constructor(private router: Router, public settings: SettingsService) {
  }

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

  openTrainRunDetails() {
    if(!this.settings.developerMode()) return;
    const url = this.router.serializeUrl(
      this.router.createUrlTree(['/train-runs', this.segment().trainRunId])
    );

    window.open(url, '_blank');
  }
}
