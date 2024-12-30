import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatButtonToggle, MatButtonToggleGroup} from "@angular/material/button-toggle";
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from "@angular/material/datepicker";
import {MatFormField, MatLabel, MatPrefix} from "@angular/material/form-field";
import {MatIcon} from "@angular/material/icon";
import {MatInput} from "@angular/material/input";
import {MatTimepicker, MatTimepickerInput, MatTimepickerToggle} from "@angular/material/timepicker";
import {DatePipe} from '@angular/common';
import {MatExpansionPanel, MatExpansionPanelHeader, MatExpansionPanelTitle} from '@angular/material/expansion';

@Component({
  selector: 'app-time-control',
  imports: [
    FormsModule,
    MatButtonToggle,
    MatButtonToggleGroup,
    MatDatepicker,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatFormField,
    MatIcon,
    MatInput,
    MatLabel,
    MatPrefix,
    MatTimepicker,
    MatTimepickerInput,
    MatTimepickerToggle,
    ReactiveFormsModule,
    DatePipe,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle
  ],
  templateUrl: './time-control.component.html',
  styleUrls: ['./time-control.component.css', '../../search.component.css']
})
export class TimeControlComponent implements OnInit {
  @Input({required: true}) requestId!: string;
  @Input({required:true}) type! : 'arrival' | 'departure';
  @Output() typeChange = new EventEmitter<'arrival' | 'departure'>();
  @Input({required:true}) dateTime! : Date;
  @Output() dateTimeChange = new EventEmitter<Date>();

  typeControl = new FormControl();
  dateControl = new FormControl();
  timeControl = new FormControl();

  ngOnInit() {
    this.typeControl.setValue(this.type);
    this.dateControl.setValue(this.dateTime);
    this.timeControl.setValue(this.dateTime);

    this.typeControl.valueChanges.subscribe(value => {this.typeChange.emit(value)});
    this.dateControl.valueChanges.subscribe(() => this._handleDateTimeChange());
    this.timeControl.valueChanges.subscribe(() => this._handleDateTimeChange());
  }

  private _handleDateTimeChange(){
    const date: Date= this.dateControl.value;
    const dateTime: Date = this.timeControl.value;
    dateTime.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
    this.dateTimeChange.emit(dateTime);
  }

  previousDay(){
    const date: Date = this.dateControl.value;
    date.setDate(date.getDate() - 1);
    this.dateControl.setValue(date);
  }

  nextDay(){
    const date: Date = this.dateControl.value;
    date.setDate(date.getDate() + 1);
    this.dateControl.setValue(date);
  }

  subtract15Min(){
    const time : Date = this.timeControl.value;
    this.timeControl.setValue(new Date(time.getTime() - 15 * 60000));
  }
  add15Min(){
    const time : Date = this.timeControl.value;
    this.timeControl.setValue(new Date(time.getTime()  + 15 * 60000));
  }
}
