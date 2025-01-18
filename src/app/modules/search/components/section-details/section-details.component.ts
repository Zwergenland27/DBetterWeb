import {Component, Input, OnInit} from '@angular/core';
import {ConnectionSectionDto, ConnectionStationDto, Demand, SearchService} from '../../search.service';
import {DatePipe, NgClass, NgIf} from '@angular/common';
import {MatIcon} from '@angular/material/icon';
import {StationDto} from '../../../station/station.service';
import {MatButton, MatMiniFabButton} from '@angular/material/button';
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
export class SectionDetailsComponent {
  @Input({required:true}) requestedClass!: 'First' | 'Second';
  @Input({required:true}) section!: ConnectionSectionDto;
  @Input({required:true}) type!: 'First' | 'End' | 'Single' | 'Middle'

  noInfoText = $localize`No information about the train type available`;
  loadingText = $localize`Loading train type`;
  plannedText = $localize`(planned)`;

  vehicleText = this.noInfoText;
  loaded = false;

  expanded = false;
  constructor(private searchService: SearchService ) {}

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

  getVehicle(){
    if(this.loaded) return;
    this.loaded = true;
    this.vehicleText = this.loadingText;
    const firstStop = this.section.stops[0];
    const lastStop = this.section.stops[this.section.stops.length - 1];
    this.searchService.getVehicle(
      this.section.category,
      this.section.lineNumber,
      firstStop.extId,
      firstStop.departure!,
      lastStop.extId,
      lastStop.arrival!).subscribe(result => {
      if(result){
        this.vehicleText = result.coaches.join(" + ");
        if(!result.realTime){
          this.vehicleText += " " + this.plannedText;
        }
      }else{
        this.vehicleText = this.noInfoText;
      }
    });
  }
}
