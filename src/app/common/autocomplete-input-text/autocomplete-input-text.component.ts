import {booleanAttribute, Component, effect, input, OnInit, output, ViewChild} from '@angular/core';
import {InputTextComponent} from '../input-text/input-text.component';
import {debounceTime, Observable, Subject, switchMap} from 'rxjs';

@Component({
  selector: 'autocomplete-input-text',
  imports: [
    InputTextComponent,
  ],
  templateUrl: './autocomplete-input-text.component.html',
  styleUrl: './autocomplete-input-text.component.scss'
})
export class AutocompleteInputTextComponent implements OnInit {
  @ViewChild('input') inputText!: InputTextComponent;

  icon = input<string>();
  buttonIcon = input<string>();
  buttonClick = output();
  label = input.required<string>();
  hint = input<string>('');
  validators = input<((value: string) => boolean)[]>([]);
  required = input(false, {transform: booleanAttribute});
  errorTranslations = input<Record<string, string>>({});
  hideErrors = input(false, {transform: booleanAttribute});
  selectAllOnFocus = input(false, {transform: booleanAttribute});

  default = input<{id: string | undefined, value:string}>({id: undefined, value: ''});
  debounceTimeMs = input<number>(0);
  autocompleteFunction = input.required<(value: string) => Observable<{id: string, value: string}[]>>();
  mustUseSuggestion = input(false, {transform: booleanAttribute});
  valueChange = output<{id: string | undefined, value:string, valid:boolean}>();

  private inputSubject = new Subject<string>();

  _selectedId : string | undefined = undefined;
  value = '';
  suggestions: {id: string, value: string}[] = [];

  _closing = false;

  ngOnInit() {
    this.value = this.default().value;
    this._selectedId = this.default().id;
    this.inputSubject
      .pipe(
        debounceTime(this.debounceTimeMs()),
        switchMap(value => this.autocompleteFunction()(value))
      ).subscribe(suggestions => {
      this.suggestions = suggestions
    })
  }

  close(event: FocusEvent){
    if(event.relatedTarget) return;
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

    this.inputSubject.next(result.value);
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
