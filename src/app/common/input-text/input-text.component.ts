import {booleanAttribute, Component, effect, input, output} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {IconComponent} from '../icon/icon.component';
import {NgIf} from '@angular/common';
import {ErrorTranslation} from '../error-translation';
import {IconButtonMiniComponent} from '../icon-button-mini/icon-button-mini.component';

@Component({
  selector: 'input-text',
  imports: [
    FormsModule,
    IconComponent,
    NgIf,
    IconButtonMiniComponent
  ],
  templateUrl: './input-text.component.html',
  styleUrl: './input-text.component.scss'
})
export class InputTextComponent {
  icon = input<string>();
  buttonIcon = input<string>();
  buttonClick = output();
  label = input.required<string>();
  hint = input<string>('');
  value = input.required<string>();
  validators = input<((value: string) => boolean)[]>([]);
  required = input(false, {transform: booleanAttribute});
  errorTranslations = input<Record<string, string>>({});
  valueChange = output<{value: string, valid: boolean}>();
  errors: ErrorTranslation[] = [];
  hideErrors = input(false, {transform: booleanAttribute});

  isValid = true;
  _value : string = ''

  constructor() {
    effect(() => {
      this._value = this.value();
    });
  }

  scrollIntoView(inputElement: HTMLElement) {
    inputElement.scrollIntoView({behavior: 'smooth', block: 'start'});
  }

  currentValueChange(value: string){
    this._value = value;
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

  validate(){
    if(this.required() && !this._value){
      this.setErrors(["Frontend.Missing"])
      return;
    }

    this.clearErrors();
  }
}
