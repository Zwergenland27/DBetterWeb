import {Component, signal} from '@angular/core';
import {AuthService} from '../../shared/services/auth.service';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {MatCard, MatCardContent} from '@angular/material/card';
import {MatFormField, MatFormFieldModule} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatIcon} from '@angular/material/icon';
import {MatButton, MatIconButton} from '@angular/material/button';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  public hide = signal(true);

  public loginForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  })
  constructor(private auth: AuthService) {
  }

  public togglePasswordVisibility(event: MouseEvent){
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  public login(){
    const val = this.loginForm.value;
    if(!val.email ||!val.password) return;
    this.auth.login(val.email, val.password);
  }
}
