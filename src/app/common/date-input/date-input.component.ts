import {booleanAttribute, Component, effect, input, output} from '@angular/core';
import {IconButtonMiniComponent} from '../icon-button-mini/icon-button-mini.component';
import {FormsModule} from '@angular/forms';
import {ErrorTranslation} from '../error-translation';
import {NgIf} from '@angular/common';

@Component({
  selector: 'date-input',
  imports: [
    IconButtonMiniComponent,
    FormsModule,
    NgIf
  ],
  templateUrl: './date-input.component.html',
  styleUrl: './date-input.component.scss'
})
export class DateInputComponent {
  label = input.required<string>();
  required = input(false, {transform: booleanAttribute});
  min = input<Date>();
  max = input<Date>();
  errorTranslations = input<Record<string, string>>({});
  errors: ErrorTranslation[] = [];
  hideErrors = input(false, {transform: booleanAttribute});

  date = input<string>('');
  dateChange = output<{date: string | undefined, valid: boolean}>();
  _date = '';

  isValid = true;

  inputId = 'input-' + crypto.randomUUID();

  constructor() {
    effect(() => {
      this._date = this.date();
    });
  }

  toLocalIsoDate(date: Date | undefined){
    if(date === undefined){
      return '';
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  showDialog(input: HTMLInputElement) {
    input.showPicker();
  }

  currentDateChange(value: string){
    this._date = value;

    this.validate();
    if(this.isValid){
      this.dateChange.emit({date: this._date, valid: true});
    }else{
      this.dateChange.emit({date: undefined, valid: this.isValid});
    }

  }

  setErrors(errorCodes: string[]){
    const errors: ErrorTranslation[] = [];
    const errorTranslations = this.errorTranslations();

    for(let errorCode of errorCodes){
      const message = errorTranslations[errorCode];
      if(message){
        errors.push(ErrorTranslation.Create(errorCode, message));
      }else{
        errors.push(ErrorTranslation.CreateWithoutTranslation(errorCode));
      }
    }

    this.errors = errors;
    this.isValid = errors.length <= 0;
  }

  clearErrors() {
    this.setErrors([]);
  }

  onBlur(){
    this.validate();
  }

  validate(){
    if(this.required() && this._date === ''){
      this.setErrors(["Frontend.Missing"])
      return;
    }

    if(this._date != ''){
      const [year, month, day] = this._date.split('-').map(Number);
      const date = new Date(year, month - 1, day, 0, 0, 0);

      if(this.min() && date < this.min()!){
        console.log(date.toISOString(), this.min()!.toISOString());
        this.setErrors(["Frontend.BeforeMinDate"]);
        return;
      }

      if(this.max() && date > this.max()!){
        this.setErrors(["Frontend.AfterMaxDate"]);
        return;
      }
    }

    this.clearErrors();
  }
}
