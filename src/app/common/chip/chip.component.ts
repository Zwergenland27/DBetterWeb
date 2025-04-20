import {Component, effect, input, output} from '@angular/core';

@Component({
  selector: 'chip',
  imports: [],
  template: `
    <button class="chip" [class.checked]="isChecked" (click)="toggle()">
      <span>{{ name() }}</span>
    </button>
  `,
  styleUrl: './chip.component.scss'
})
export class ChipComponent {
  name = input.required<string>();
  checked = input.required<boolean>();
  checkedChange = output<boolean>();

  isChecked = false;

  constructor() {
    effect(() => {
      this.isChecked = this.checked();
    });
  }

  toggle(){
    this.isChecked = !this.isChecked;
    this.checkedChange.emit(this.isChecked);
  }
}
