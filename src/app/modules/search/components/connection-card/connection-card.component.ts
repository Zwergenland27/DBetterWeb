import {Component, Input} from '@angular/core';
import {ConnectionDto, ConnectionSectionDto, SearchService} from '../../search.service';
import {CurrencyPipe, DatePipe, NgIf} from '@angular/common';
import {MatButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {MatTooltip} from '@angular/material/tooltip';
import {DemandComponent} from '../demand/demand.component';
import {SectionDetailsComponent} from '../section-details/section-details.component';
import {MatProgressSpinner} from '@angular/material/progress-spinner';

@Component({
  selector: 'app-connection-card',
  imports: [
    DatePipe,
    MatButton,
    MatIcon,
    MatTooltip,
    DemandComponent,
    CurrencyPipe,
    SectionDetailsComponent,
    NgIf,
    MatProgressSpinner,
  ],
  templateUrl: './connection-card.component.html',
  styleUrl: './connection-card.component.css'
})
export class ConnectionCardComponent {
  @Input({required: true}) showBikeInfo!: boolean;
  @Input({required: true}) showAccessibilityInfo!: boolean;
  @Input({required: true}) requestedClass!: 'First' | 'Second';
  @Input({required: false}) connection!: ConnectionDto;

  expanded = false;
  loadingTransferTimeChange = false;

  constructor(private searchService: SearchService) {
  }

  get startTime(){
    const section = this.connection.sections[0];
    return new Date(section.stops[0].departure!);
  }

  get endTime(){
    const section = this.connection.sections[this.connection.sections.length - 1];
    return new Date(section.stops[section.stops.length - 1].arrival!);
  }

  getSectionInfos(i: number){
    return this.connection.sections[i].information.filter(info => info.priority > 1);
  }

  getConnectionInfos(){
    return this.connection.information.filter(info => info.priority > 1);
  }

  get duration(){
    const difference = Math.abs(this.endTime.getTime() - this.startTime.getTime());
    const hours = Math.floor(difference / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (60000));
    return {
      hours: hours,
      minutes: minutes
    };
  }

  get transfers(){
    return this.connection.sections.length - 1;
  }

  togglePanel(){
    this.expanded = !this.expanded
  }

  getTransferTime(firstSection : ConnectionSectionDto, secondSection : ConnectionSectionDto){
    const arrival = new Date(firstSection.stops[firstSection.stops.length - 1].arrival!);
    const departure = new Date(secondSection.stops[0].departure!);
    const difference = Math.abs(departure.getTime() - arrival.getTime());
    const hours = Math.floor(difference / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (60000));
    return {
      hours: hours,
      minutes: minutes
    };
  }

  public laterDeparture(sectionIndex: number){
    this.loadingTransferTimeChange = true;


    const currentSection = this.connection.sections[sectionIndex];
    const sectionStartStation = this.connection.sections[0].stops[0];
    const sectionEndStation = currentSection.stops[currentSection.stops.length - 1];

    this.searchService.getConnection(
      this.connection.contextId,
      "Later",
      sectionStartStation,
      sectionEndStation).subscribe({
      next: (result) => {
        this.connection = result;
      },
      error: () => {
        this.loadingTransferTimeChange = false;
      },
      complete: () => {
        this.loadingTransferTimeChange = false;
      }
    });
  }

  public earlierArrival(sectionIndex: number){
    this.loadingTransferTimeChange = true;

    const lastSectionIndex = this.connection.sections.length - 1;
    const sectionStartStation = this.connection.sections[sectionIndex + 1].stops[0];
    const sectionEndStation = this.connection.sections[lastSectionIndex].stops[this.connection.sections[lastSectionIndex].stops.length - 1];

    this.searchService.getConnection(
      this.connection.contextId,
      "Earlier",
      sectionStartStation,
      sectionEndStation).subscribe({
        next: (result) => {
          this.connection = result;
        },
        error: () => {
          this.loadingTransferTimeChange = false;
        },
        complete: () => {
          this.loadingTransferTimeChange = false;
        }
      });
  }

  public openBahnBooking(){
    window.open(this.connection.bahnRequestUrl, "_blank");
  }
}
