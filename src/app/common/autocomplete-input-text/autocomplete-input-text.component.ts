import {booleanAttribute, Component, effect, input, output, ViewChild} from '@angular/core';
import {InputTextComponent} from '../input-text/input-text.component';
import {Observable} from 'rxjs';

@Component({
  selector: 'autocomplete-input-text',
  imports: [
    InputTextComponent,
  ],
  templateUrl: './autocomplete-input-text.component.html',
  styleUrl: './autocomplete-input-text.component.scss'
})
export class AutocompleteInputTextComponent {
  @ViewChild('input') inputText!: InputTextComponent;

  icon = input<string>();
  buttonIcon = input<string>();
  buttonClick = output();
  label = input.required<string>();
  hint = input<string>('');
  validators = input<((value: string) => boolean)[]>([]);
  required = input(false, {transform: booleanAttribute});
  errorTranslations = input<Record<string, string>>({});

  default = input<string>('');
  autocompleteFunction = input.required<(value: string) => Observable<{id: string, value: string}[]>>();
  mustUseSuggestion = input(false, {transform: booleanAttribute});
  valueChange = output<{id: string | undefined, value:string, valid:boolean}>();

  _selectedId : string | undefined = undefined;
  value = '';
  suggestions: {id: string, value: string}[] = [];

  _closing = false;

  constructor() {
    effect(() => {
      this.value = this.default();
    });
  }

  close(){
    setTimeout(() => {
      this.suggestions = [];
      if(this.mustUseSuggestion() && this._selectedId === undefined){
        this._closing = true;
        this.inputText.currentValueChange('');
        this.value = '';
      }
    }, 150)
  }

  onValueChange(result: {value: string, valid: boolean}) {
    this._selectedId = undefined;
    this.value = result.value;

    this.valueChange.emit({
      id: undefined,
      value: result.value,
      valid: result.valid,
    });

    if(this._closing){
      this._closing = false;
      return;
    }

    this.autocompleteFunction()(result.value).subscribe(
      value => {
        this.suggestions = value;
      }
    );
  }

  select(id: string){
    const value = this.suggestions.find(s => s.id === id)!.value;
    this.valueChange.emit({
      id: id,
      value: value,
      valid: true
    });
    this._selectedId = id;
    this.value = value;
    this.suggestions = [];
  }
}
