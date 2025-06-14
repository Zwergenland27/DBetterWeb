import { Component } from '@angular/core';

@Component({
  selector: 'loader',
  imports: [],
  template: `
    <div>

    </div>
  `,
  styleUrl: './loader.component.scss'
})
export class LoaderComponent {
  //TODO: integrate loader in button -> when button clicked, click action gets blocked and loader is being displayed behind text
}
