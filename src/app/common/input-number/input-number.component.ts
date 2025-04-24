import {booleanAttribute, Component, effect, input, output} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {ErrorTranslation} from '../error-translation';
import {IconButtonMiniComponent} from '../icon-button-mini/icon-button-mini.component';
import {IconComponent} from '../icon/icon.component';
import {NgIf} from '@angular/common';

@Component({
  selector: 'input-number',
  imports: [
    FormsModule,
    IconButtonMiniComponent,
    IconComponent,
    NgIf
  ],
  templateUrl: './input-number.component.html',
  styleUrl: './input-number.component.scss'
})
export class InputNumberComponent {
  icon = input<string>();
  buttonIcon = input<string>();
  buttonClick = output();
  label = input.required<string>();
  prefix = input<string>('');
  suffix = input<string>('');
  value = input.required<number>();
  minValue = input<number>();
  maxValue = input<number>();
  required = input(false, {transform: booleanAttribute});
  errorTranslations = input<Record<string, string>>({});
  valueChange = output<{value: number | undefined, valid: boolean}>();
  errors: ErrorTranslation[] = [];
  hideErrors = input(false, {transform: booleanAttribute});
  selectAllOnFocus = input(false, {transform: booleanAttribute});

  textValue(value: number | undefined){
    if(value === undefined) return '';
    if(this.focused) return value;
    let text = '';
    if(this.prefix()){
      text += `${this.prefix()} `;
    }

    text += value;

    if(this.suffix()){
      text += ` ${this.suffix()}`;
    }

    return text;
  }

  isValid = true;
  _value: number | undefined = undefined;
  inputId = 'input-' + crypto.randomUUID();

  focused = false;

  constructor() {
    effect(() => {
      this._value = this.value();
    });
  }

  onFocus(inputElement: HTMLInputElement) {
    this.focused = true;
    inputElement.scrollIntoView({behavior: 'smooth', block: 'start'});
    if(this.selectAllOnFocus()){
      setTimeout(() => {inputElement.select();})
    }
  }

  onInput(event: InputEvent) {
    if(!event.data) return;

    if(isNaN(Number(event.data))){
      event.preventDefault();
      return;
    }
  }

  currentValueChange(value: string){
    this._value = Number(value);

    if(!value) this._value = undefined;

    this.validate();
    this.valueChange.emit({value: this._value, valid: this.isValid});
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
    this.focused = false;
    this.validate();
  }

  validate(){
    if(this.required() && !this._value){
      this.setErrors(["Frontend.Missing"])
      return;
    }

    if(this.minValue() && this._value != undefined && this._value < this.minValue()!){
      this.setErrors(["Frontend.TooSmall"]);
      return;
    }

    if(this.maxValue() && this._value != undefined && this._value > this.maxValue()!){
      this.setErrors(["Frontend.TooLarge"]);
      return;
    }

    this.clearErrors();
  }
}
