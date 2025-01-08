import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ExpansionPanelComponent} from '../expansion-panel/expansion-panel.component';
import {MatExpansionPanelTitle} from '@angular/material/expansion';
import {OptionsDto} from '../../search.service';
import {MatButtonToggle, MatButtonToggleGroup} from '@angular/material/button-toggle';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatOption} from '@angular/material/core';
import {MatSelect} from '@angular/material/select';

@Component({
  selector: 'app-options-control',
  imports: [
    ExpansionPanelComponent,
    MatExpansionPanelTitle,
    MatButtonToggle,
    MatButtonToggleGroup,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatOption,
    MatSelect,
    FormsModule
  ],
  templateUrl: './options-control.component.html',
  styleUrl: './options-control.component.css'
})
export class OptionsControlComponent implements OnInit {
  private UI_KEY = 'options-control-ui';
  expanded : boolean;

  @Input({required: true}) options! : OptionsDto;
  @Output() optionsChange = new EventEmitter<OptionsDto>();

  classControl = new FormControl();
  maxTransfersControl = new FormControl();
  minTransferTimeControl = new FormControl();

  constructor() {
    const uiState = sessionStorage.getItem(this.UI_KEY);
    if(uiState){
      this.expanded = JSON.parse(uiState);
    }else{
      this.expanded = true;
    }
  }

  ngOnInit(): void {
    this.classControl.setValue(this.options.class);
    this.maxTransfersControl.setValue(this.options.maxTransfers);
    this.minTransferTimeControl.setValue(this.options.minTransferTime);

    this.classControl.valueChanges.subscribe(value => {
      this.options.class = value;
      this.optionsChange.emit(this.options)
    });
    this.maxTransfersControl.valueChanges.subscribe(value => {
      this.options.maxTransfers = value;
      this.optionsChange.emit(this.options)
    });
    this.minTransferTimeControl.valueChanges.subscribe(value => {
      this.options.minTransferTime = value;
      this.optionsChange.emit(this.options)
    });
  }
  public persistUIState(){
    sessionStorage.setItem(this.UI_KEY, JSON.stringify(this.expanded));
  }

  public generateArray(start: number, end: number){
    const array = [];
    for(let i = start; i <= end; i++){
      array.push(i);
    }
    return array;
  }
}
