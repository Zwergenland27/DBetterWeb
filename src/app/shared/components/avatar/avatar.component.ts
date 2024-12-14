import {Component, Input} from '@angular/core';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'app-avatar',
  imports: [
    MatIcon
  ],
  templateUrl: './avatar.component.html',
  styleUrl: './avatar.component.css'
})
export class AvatarComponent {
  @Input({required: false}) image : string | null = null;
  @Input({required: false}) name: string | null = null;
}
