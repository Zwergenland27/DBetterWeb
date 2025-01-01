import {Component, Input} from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {AvatarComponent} from '../../../../shared/components/avatar/avatar.component';
import {getShortTitleOfDiscount, PassengerDto} from '../../search.service';

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

  @Input({ required: true }) passenger! : PassengerDto;

  @Input({ required: false }) tripDate : Date = new Date();
  protected readonly getShortTitleOfDiscount = getShortTitleOfDiscount;

  public calcPassengerAge(passenger: PassengerDto, tripTime : Date) {
    if(passenger.age != null){
      return passenger.age;
    }

    const birthday = new Date(passenger.birthday!);
    //27.11.2002 00:00
    //01.01.2025 10:45
    //2025 - 2002 = 23
    //

    let age = tripTime.getFullYear() - birthday.getFullYear();
    const monthDifference = tripTime.getMonth() - birthday.getMonth();
    const dayDifference = tripTime.getDate() - birthday.getDate();

    if(monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)){
      age--;
    }

    return age;
  }
}
