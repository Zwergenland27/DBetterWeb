import { Component } from '@angular/core';
import {AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatButton} from "@angular/material/button";
import {MatCardModule} from "@angular/material/card";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {AuthService} from '../../shared/services/auth.service';
import {UserService} from '../../shared/services/user.service';
import {MatDatepickerModule} from '@angular/material/datepicker';

@Component({
  selector: 'app-register',
  imports: [
    FormsModule,
    MatButton,
    MatCardModule,
    MatFormField,
    MatInputModule,
    MatLabel,
    ReactiveFormsModule,
    MatDatepickerModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  public registerForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    firstname: new FormControl('', [Validators.required]),
    lastname: new FormControl('', [Validators.required]),
    birthday: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    confirmedPassword: new FormControl('', [Validators.required]),
  }, {
    validators: [
      this.passwordConfirmValidator
    ]
  });
  constructor(private auth: AuthService, private userService: UserService) {}

  passwordConfirmValidator(control: AbstractControl) {
    const currentPassword = control.get('password');
    const currentConfirmedPassword = control.get('confirmedPassword');

    if(!currentPassword || !currentConfirmedPassword) return null;

    const confirmationMatch = currentPassword.value === currentConfirmedPassword.value;
    if(confirmationMatch) return null;

    const error = {confirmationFailed: true};
    currentConfirmedPassword.setErrors(error);
    return error;
  }

  public async register(){
    const val = this.registerForm.value!;
    await this.userService.register(val.firstname!, val.lastname!, val.birthday!, val.email!, val.password!);
    this.auth.login(val.email!, val.password!);
  }
}
