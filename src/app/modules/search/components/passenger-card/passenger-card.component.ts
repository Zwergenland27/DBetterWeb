import {Component, Input} from '@angular/core';
import {Passenger} from '../../models/passenger.model';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {AvatarComponent} from '../../../../shared/components/avatar/avatar.component';
import {getShortTitleOfDiscount} from '../../search.service';

@Component({
  selector: 'app-passenger-card',
  imports: [
    MatCardModule,
    MatIconModule,
    AvatarComponent,
  ],
  templateUrl: './passenger-card.component.html',
  styleUrl: './passenger-card.component.css'
})
export class PassengerCardComponent {

  @Input({ required: true }) passenger! : Passenger;

  @Input({ required: false }) tripDate : Date = new Date();
  protected readonly getShortTitleOfDiscount = getShortTitleOfDiscount;
}
