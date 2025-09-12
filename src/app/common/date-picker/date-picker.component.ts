import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  effect,
  ElementRef,
  input,
  OnDestroy,
  output,
  viewChild
} from '@angular/core';
import {DatePipe,} from '@angular/common';
import {IconButtonMiniComponent} from '../icon-button-mini/icon-button-mini.component';

@Component({
  selector: 'date-picker',
  imports: [
    IconButtonMiniComponent,
    DatePipe,
  ],
  templateUrl: './date-picker.component.html',
  styleUrl: './date-picker.component.scss'
})
export class DatePickerComponent implements OnDestroy {
  inputTarget = input.required<HTMLElement>();
  dialog = viewChild<ElementRef<HTMLElement>>("dialog");
  overlay = viewChild<ElementRef<HTMLElement>>("overlay");

  position: {x: number, y: number} = {x: 0, y: 0};

  selectedDate = input.required<string>();
  selectedDateChange = output<string>();
  closed = output();

  lookingAt: {
    year: number,
    month: number,
  }

  selected: {
    year: number,
    month: number,
    day: number,
  } | null = null;

  days: number[] = [];

  private resizeObserver;
  private windowResizeListener;

  get activeMonth(){
    return new Date(this.lookingAt.year, this.lookingAt.month);
  }

  overlayClick(event: PointerEvent){
    if(event.target != this.overlay()?.nativeElement) return;
    this.closed.emit();
  }

  isToday(day: number){
    const today = new Date();
    return today.getFullYear() === this.lookingAt.year &&
            today.getMonth() === this.lookingAt.month &&
            today.getDate() === day;
  }

  isSelected(day: number){
    if(!this.selected) return false;

    return this.lookingAt.year === this.selected.year &&
      this.lookingAt.month === this.selected.month &&
      day === this.selected.day;
  }

  constructor(private cdr: ChangeDetectorRef) {
    const now = new Date();

    document.body.style.overflow = 'hidden';

    this.lookingAt = {
      year: now.getFullYear(),
      month: now.getMonth(),
    }

    this.resizeObserver = new ResizeObserver(() => {
      this.setNewPosition();
    });

    this.windowResizeListener = () => {
      this.setNewPosition();
    };

    window.addEventListener('resize', this.windowResizeListener);

    this.generateDays();

    effect(() => {
      this.resizeObserver.observe(this.dialog()!.nativeElement!)

      const inputDate = this.selectedDate();
      if(inputDate){
        const date = new Date(inputDate);
        this.lookingAt = {
          year: date.getFullYear(),
          month: date.getMonth(),
        }

        this.selected = {
          year: date.getFullYear(),
          month: date.getMonth(),
          day: date.getDate()
        }
      }
      this.generateDays();
    });
  }

  private setNewPosition() {
    const targetRect = this.inputTarget().getBoundingClientRect();
    const dialogRect = this.dialog()!.nativeElement.getBoundingClientRect();

    let yOffset = targetRect.top + targetRect.height

    if(yOffset + dialogRect.height >= window.innerHeight) {
      this.position = {x:targetRect.left, y:targetRect.top - dialogRect.height};
    }else{
      this.position = {x: targetRect.left, y: yOffset};
    }

    this.cdr.detectChanges();
  }

  ngOnDestroy(): void {
    this.resizeObserver.disconnect();

    window.removeEventListener('resize', this.windowResizeListener);

    document.body.style.overflow = '';
  }

  generateDays() {
    const firstDay = new Date(Date.UTC(this.lookingAt.year, this.lookingAt.month, 1));

    const daysInPreviousMonth = (firstDay.getDay() + 6) % 7;

    this.days = new Array(daysInPreviousMonth).fill(0);

    while(firstDay.getMonth() === this.lookingAt.month){
      this.days.push(firstDay.getDate());
      firstDay.setDate(firstDay.getDate() + 1);
    }
  }

  previousMonth() {
    this.lookingAt.month -= 1;

    if(this.lookingAt.month < 0){
      this.lookingAt.month += 12;
      this.lookingAt.year -= 1;
    }

    this.generateDays();
  }

  nextMonth() {
    this.lookingAt.month += 1;

    if(this.lookingAt.month > 11){
      this.lookingAt.month -= 12;
      this.lookingAt.year += 1;
    }
    this.generateDays();
  }

  selectDate(day: number) {
    this.selected = {
      year: this.lookingAt.year,
      month: this.lookingAt.month,
      day: day,
    }

    const date = new Date(Date.UTC(this.selected.year, this.selected.month, day));
    this.selectedDateChange.emit(date.toISOString().split('T')[0]);
  }
}
