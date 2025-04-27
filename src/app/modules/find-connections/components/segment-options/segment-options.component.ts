import {Component, effect, input, output} from '@angular/core';
import {IconButtonMiniComponent} from '../../../../common/icon-button-mini/icon-button-mini.component';
import {ChipComponent} from '../../../../common/chip/chip.component';
import {
  getMeansOfTransportDefault,
  MeansOfTransportParameters
} from '../../contracts/parameters/means-of-transport-parameters';

@Component({
  selector: 'segment-options',
  imports: [
    IconButtonMiniComponent,
    ChipComponent,
  ],
  templateUrl: './segment-options.component.html',
  styleUrl: './segment-options.component.scss'
})
export class SegmentOptionsComponent {
  withButton = input<boolean>(true)
  addClick = output();

  allowedMeansOfTransport = input.required<MeansOfTransportParameters>();
  allowedMeansOfTransportChange = output<MeansOfTransportParameters>();

  currentAllowedMeansOfTransport = getMeansOfTransportDefault();

  constructor() {
    effect(() => {
      this.currentAllowedMeansOfTransport = this.allowedMeansOfTransport();
    });
  }

  allowHighSpeedTrainsChanged(allowed: boolean) {
    this.currentAllowedMeansOfTransport.highSpeedTrains = allowed;
    this.allowedMeansOfTransportChange.emit(this.currentAllowedMeansOfTransport);
  }

  allowFastTrainsChanged(allowed: boolean) {
    this.currentAllowedMeansOfTransport.fastTrains = allowed;
    this.allowedMeansOfTransportChange.emit(this.currentAllowedMeansOfTransport);
  }

  allowRegionalTrainsChanged(allowed: boolean) {
    this.currentAllowedMeansOfTransport.regionalTrains = allowed;
    this.allowedMeansOfTransportChange.emit(this.currentAllowedMeansOfTransport);
  }

  allowSuburbanTrainsChanged(allowed: boolean) {
    this.currentAllowedMeansOfTransport.suburbanTrains = allowed;
    this.allowedMeansOfTransportChange.emit(this.currentAllowedMeansOfTransport);
  }

  allowUndergroundsChanged(allowed: boolean) {
    this.currentAllowedMeansOfTransport.undergroundTrains = allowed;
    this.allowedMeansOfTransportChange.emit(this.currentAllowedMeansOfTransport);
  }

  allowTramsChanged(allowed: boolean) {
    this.currentAllowedMeansOfTransport.trams = allowed;
    this.allowedMeansOfTransportChange.emit(this.currentAllowedMeansOfTransport);
  }

  allowBussesChanged(allowed: boolean) {
    this.currentAllowedMeansOfTransport.busses = allowed;
    this.allowedMeansOfTransportChange.emit(this.currentAllowedMeansOfTransport);
  }

  allowBoatsChanged(allowed: boolean) {
    this.currentAllowedMeansOfTransport.boats = allowed;
    this.allowedMeansOfTransportChange.emit(this.currentAllowedMeansOfTransport);
  }
}
