import {Component} from '@angular/core';
import {AuthService} from '../../shared/services/auth.service';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButton} from '@angular/material/button';
import {Router} from '@angular/router';
import {ProblemDetails} from '../../shared/interceptors/error-handling.interceptor';

@Component({
  selector: 'app-login',
  imports: [
    MatFormFieldModule,
    MatCardModule,
    MatButton,
    MatInputModule,
    ReactiveFormsModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  public loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  })
  constructor(private auth: AuthService, private router: Router) {
  }

  public login(){
    const val = this.loginForm.value;
    if(!val.email ||!val.password) return;
    this.auth.login(val.email, val.password)
      .subscribe({
        complete: async () => {
          await this.router.navigate(['/'])
        },
        error: (error: ProblemDetails) => {
          if(error.containsError('User.InvalidCredentials')){
            this.loginForm.setErrors({invalidCredentials: true});
          }
        }
      })
  }
}
