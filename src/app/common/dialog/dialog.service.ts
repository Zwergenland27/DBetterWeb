import {ApplicationRef, Injectable, Type} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  constructor(private appRef: ApplicationRef) {
  }

  create<D>(component: Type<D>): D {
    const container = document.getElementById("dialog");
    const componentRef = this.appRef.bootstrap(component, container);

    return componentRef.instance;
  }
}
