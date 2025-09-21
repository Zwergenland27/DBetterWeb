import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  effect,
  ElementRef,
  input,
  OnDestroy,
  output, QueryList,
  viewChild, viewChildren
} from '@angular/core';

@Component({
  selector: 'time-picker',
  imports: [
  ],
  templateUrl: './time-picker.component.html',
  styleUrl: './time-picker.component.scss'
})
export class TimePickerComponent implements AfterViewInit, OnDestroy {
  inputTarget = input.required<HTMLElement>();
  dialog = viewChild.required<ElementRef<HTMLElement>>("dialog");
  overlay = viewChild.required<ElementRef<HTMLElement>>("overlay");

  hourButtons = viewChildren<ElementRef<HTMLElement>>("hour");
  minuteButtons = viewChildren<ElementRef<HTMLElement>>("minute");

  position: {x: number, y: number} = {x: 0, y: 0};

  selectedTime = input.required<string>();
  selectedTimeChange = output<string>();
  closed = output();

  selectedHour: number | null = null;
  selectedMinute: number | null = null;

  private resizeObserver;
  private windowResizeListener;

  hoursBase = [...Array(24).keys()]
  minutesBase = [...Array(60).keys()]

  hours = [...this.hoursBase, ...this.hoursBase, ...this.hoursBase];
  minutes = [...this.minutesBase, ...this.minutesBase, ...this.minutesBase];

  overlayClick(event: PointerEvent){
    if(event.target != this.overlay().nativeElement) return;
    this.closed.emit();
  }

  constructor(private cdr: ChangeDetectorRef) {
    document.body.style.overflow = 'hidden';

    this.resizeObserver = new ResizeObserver(() => {
      this.setNewPosition();
    });

    this.windowResizeListener = () => {
      this.setNewPosition();
    };

    window.addEventListener('resize', this.windowResizeListener);

    effect(() => {
      this.resizeObserver.observe(this.dialog().nativeElement)

      const time = this.selectedTime();
      if(time){
        const [hours, minutes] = time.split(':').map(Number);
        this.selectedHour = hours;

        this.selectedMinute = minutes;
      }
    });
  }

  ngAfterViewInit(): void {
    this.scrollToSelected('instant');
  }

  private scrollToSelected(scrollBehavior: ScrollBehavior) {
    const scrollToHour = this.selectedHour ?? new Date().getHours();
    const scrollToMinute = this.selectedMinute ?? new Date().getMinutes();

    this.hourButtons().at(scrollToHour + 24)!.nativeElement.scrollIntoView({behavior: scrollBehavior, block: 'start'});
    this.minuteButtons().at(scrollToMinute + 60)!.nativeElement.scrollIntoView({behavior: scrollBehavior, block: 'start'});
  }

  selectHour(hour: number){
    this.selectedHour = hour;
    this.emitChange();
  }

  isHourSelected(hour: number) {
    if(this.selectedHour == null) return false;
    return this.selectedHour === hour;
  }

  selectMinute(minute: number) {
    this.selectedMinute = minute;
    this.emitChange();
  }

  isMinuteSelected(minute: number) {
    if(this.selectedMinute == null) return false;
    return this.selectedMinute === minute;
  }

  private emitChange(){
    this.scrollToSelected('smooth');
    if(this.selectedHour == null || this.selectedMinute == null){
      this.selectedTimeChange.emit("");
      return;
    }

    const time = `${this.selectedHour.toString().padStart(2, '0')}:${this.selectedMinute.toString().padStart(2, '0')}`;
    this.selectedTimeChange.emit(time);
  }

  private setNewPosition() {
    const targetRect = this.inputTarget().getBoundingClientRect();
    const dialogRect = this.dialog().nativeElement.getBoundingClientRect();

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
}
