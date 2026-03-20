import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {TrainRunService} from './train-run.service';
import {switchMap} from 'rxjs';
import {TrainRun} from './contracts/responses/trainRunResponse';
import {DatePipe, NgClass} from '@angular/common';
import {IconComponent} from '../../common/icon/icon.component';
import {DemandDto, DemandStatus} from '../../common/contracts/dtos/demand';

@Component({
  selector: 'app-train-runs',
  imports: [
    DatePipe,
    IconComponent,
    NgClass
  ],
  templateUrl: './train-runs.component.html',
  styleUrl: './train-runs.component.scss'
})
export class TrainRunsComponent implements OnInit, OnDestroy {

  constructor(private route: ActivatedRoute, private trainRunService: TrainRunService) {
  }

  trainRun?: TrainRun;

  ngOnInit(): void {
    this.route.paramMap.pipe(
      switchMap(params => {
        const id = params.get("id")!;
        return this.trainRunService.get(id);
      })
    ).subscribe(async trainRun => {
      this.trainRun = trainRun
      await this.trainRunService.subscribeToTrainCompositionRealtimeFeed(this.trainRun.id, (trainComposition) => {
        trainRun.trainComposition = trainComposition;
      });
    });
  }

  async ngOnDestroy() {
    if(this.trainRun === undefined) return;
    await this.trainRunService.unsubscribeFromTrainCompositionRealtimeFeed(this.trainRun.id);
  }

  getDemand(index: number){
    let demand : DemandDto = {
      firstClass: DemandStatus.Unknown,
      secondClass: DemandStatus.Unknown,
    };

    if(index >= 0){
      demand =  this.trainRun!.stops[index].demand;
    }
    return demand.secondClass;
  }
}
