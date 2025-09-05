import {booleanAttribute, Component, effect, input, output} from '@angular/core';
import {ErrorTranslation} from '../error-translation';
import {FormsModule} from '@angular/forms';
import {IconButtonMiniComponent} from '../icon-button-mini/icon-button-mini.component';


@Component({
  selector: 'time-input',
  imports: [
    FormsModule,
    IconButtonMiniComponent
],
  templateUrl: './time-input.component.html',
  styleUrl: './time-input.component.scss'
})
export class TimeInputComponent {
  label = input.required<string>();
  required = input(false, {transform: booleanAttribute});
  errorTranslations = input<Record<string, string>>({});
  errors: ErrorTranslation[] = [];
  hideErrors = input(false, {transform: booleanAttribute});

  time = input<string>('');
  timeChange = output<{time: string | undefined, valid: boolean}>();
  _time = '';

  isValid = true;

  inputId = 'input-' + crypto.randomUUID();

  constructor() {
    effect(() => {
      this._time = this.time();
    });
  }

  showDialog(input: HTMLInputElement) {
    input.showPicker();
  }

  currentTimeChange(value: string){
    this._time = value;
    this.validate();
    if(this.isValid){
      this.timeChange.emit({time: this._time, valid: true});
    }else{
      this.timeChange.emit({time: undefined, valid: this.isValid});
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
    if(this.required() && this._time === ''){
      this.setErrors(["Frontend.Missing"])
      return;
    }

    this.clearErrors();
  }
}
