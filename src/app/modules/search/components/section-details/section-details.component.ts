import {Component, Input, OnInit} from '@angular/core';
import {ConnectionSectionDto, ConnectionStationDto, Demand, SearchService} from '../../search.service';
import {DatePipe, NgClass, NgIf} from '@angular/common';
import {MatIcon} from '@angular/material/icon';
import {StationDto} from '../../../station/station.service';
import {MatButton} from '@angular/material/button';
import {MatTooltip} from '@angular/material/tooltip';

@Component({
  selector: 'app-section-details',
  imports: [
    DatePipe,
    MatIcon,
    NgClass,
    NgIf,
    MatButton,
    MatTooltip
  ],
  templateUrl: './section-details.component.html',
  styleUrl: './section-details.component.css'
})
export class SectionDetailsComponent implements OnInit {
  @Input({required:true}) requestedClass!: 'First' | 'Second';
  @Input({required:true}) section!: ConnectionSectionDto;
  @Input({required:true}) type!: 'First' | 'End' | 'Single' | 'Middle'

  expanded = false;
  vehicle : string = "";
  realTime = true;
  constructor(private searchService: SearchService ) {}

  ngOnInit() {
    const firstStop = this.section.stops[0];
    this.searchService.getVehicle(this.section.category, this.section.lineNumber, firstStop.departure!, firstStop.extId).subscribe(result => {
      if(result){
        this.vehicle = result.coaches.join(" + ");
        this.realTime = result.realTime;
      }
    });
  }

  get sectionDuration(){
    const startTime = new Date(this.section.stops[0].departure!);
    const endTime = new Date(this.section.stops[this.section.stops.length - 1].arrival!);
    const difference = Math.abs(endTime.getTime() - startTime.getTime());
    const hours = Math.floor(difference / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (60000));
    return {
      hours: hours,
      minutes: minutes
    };
  };

  getDemandClass(demand: Demand){
    if(this.requestedClass == 'First'){
      return demand.firstClass.toLowerCase();
    }
    return demand.secondClass.toLowerCase();
  }

  isExitOnly(stop: ConnectionStationDto){
    return stop.information.filter(i => i.code == 'Ris.Stop.ExitOnly').length > 0;
  }

  isEntryOnly(stop: ConnectionStationDto){
    return stop.information.filter(i => i.code == 'Ris.Stop.EntryOnly').length > 0;
  }

  isCancelled(stop: ConnectionStationDto){
    return stop.information.filter(i => i.code == 'Ris.Stop.Cancelled').length > 0;
  }

  isAdditional(stop: ConnectionStationDto){
    return stop.information.filter(i => i.code == 'Ris.Stop.Additional').length > 0;
  }
}
