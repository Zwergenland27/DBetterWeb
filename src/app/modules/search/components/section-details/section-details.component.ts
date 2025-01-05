import {Component, Input} from '@angular/core';
import {ConnectionSectionDto, Demand} from '../../search.service';
import {DatePipe, NgClass, NgIf} from '@angular/common';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'app-section-details',
  imports: [
    DatePipe,
    MatIcon,
    NgClass,
    NgIf
  ],
  templateUrl: './section-details.component.html',
  styleUrl: './section-details.component.css'
})
export class SectionDetailsComponent {
  @Input({required:true}) requestedClass!: 'First' | 'Second';
  @Input({required:true}) section!: ConnectionSectionDto;
  @Input({required:true}) type!: 'First' | 'End' | 'Single' | 'Middle'

  expanded = false;

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
}
