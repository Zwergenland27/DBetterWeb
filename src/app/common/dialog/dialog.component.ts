import {Component, input, output} from '@angular/core';
import {IconComponent} from '../icon/icon.component';
import {IconButtonMiniComponent} from '../icon-button-mini/icon-button-mini.component';
import {FloatingButtonComponent} from '../floating-button/floating-button.component';

@Component({
  selector: 'app-dialog',
  imports: [
    IconComponent,
    IconButtonMiniComponent,
    FloatingButtonComponent
  ],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss'
})
export class DialogComponent {
  icon = input<string>();
  dialogTitle = input.required<string>();
  cancelButtonText = input.required<string>();
  secondaryButtonText = input<string>();
  secondaryClicked = output();
  primaryButtonText = input<string>();
  primaryClicked = output();

  isVisible = false;
  open(){
    this.isVisible = true;
    document.body.style.overflow = 'hidden';
  }

  close(){
    this.isVisible = false;
    document.body.style.overflow = '';
  }

  primaryButtonClicked(){
    this.primaryClicked.emit();
  }

  secondaryButtonClicked(){
    this.secondaryClicked.emit();
  }
}
