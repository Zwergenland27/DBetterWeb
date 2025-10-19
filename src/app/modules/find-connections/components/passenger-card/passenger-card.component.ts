import {Component, input, output} from '@angular/core';
import {
  PassengerOptionsData,
  SelectableDiscountClass
} from '../passenger-options/passenger-options-data';
import {IconButtonMiniComponent} from '../../../../common/icon-button-mini/icon-button-mini.component';
import {IconComponent} from '../../../../common/icon/icon.component';

@Component({
  selector: 'passenger-card',
  imports: [
    IconButtonMiniComponent,
    IconComponent
  ],
  templateUrl: './passenger-card.component.html',
  styleUrl: './passenger-card.component.scss'
})
export class PassengerCardComponent {
  passenger = input.required<PassengerOptionsData>();
  removed = output();
  protected readonly SelectableDiscountClass = SelectableDiscountClass;

  test(i: number){
    console.log(i);
  }
}
