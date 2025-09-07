import {booleanAttribute, Component, effect, input, output} from '@angular/core';
import {IconButtonMiniComponent} from '../icon-button-mini/icon-button-mini.component';
import {FormsModule} from '@angular/forms';
import {ErrorTranslation} from '../error-translation';


@Component({
  selector: 'date-input',
  imports: [
    IconButtonMiniComponent,
    FormsModule
],
  templateUrl: './date-input.component.html',
  styleUrl: './date-input.component.scss'
})
export class DateInputComponent {
  label = input.required<string>();
  required = input(false, {transform: booleanAttribute});
  min = input<string>();
  max = input<string>();
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
      this.currentDateChange(this.date());
    });
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
    let [year, month, day] = this._date.split('-').map(Number);

    if(isNaN(year) || isNaN(month) || isNaN(day)){
      if(this.required()){
        this.setErrors(["Frontend.Missing"]);
        return;
      }

      const date = new Date(year, month - 1, day, 0, 0, 0);

      if(this.min()){
        [year, month, day] = this.min()!.split('-').map(Number);
        const min = new Date(year, month - 1, day, 0, 0, 0);

        if(date < min){
          this.setErrors(["Frontend.BeforeMinDate"]);
          return;
        }
      }

      if(this.max()){
        [year, month, day] = this.max()!.split('-').map(Number);
        const max = new Date(year, month - 1, day, 0, 0, 0);

        if(date > max){
          this.setErrors(["Frontend.AfterMaxDate"]);
          return;
        }
      }
    }

    this.clearErrors();
  }
}
