import {Component, Input} from '@angular/core';
import {AuthService} from '../../shared/services/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-account',
  imports: [],
  templateUrl: './account.component.html',
  styleUrl: './account.component.css'
})
export class AccountComponent {
  userId : string | null = null;
  @Input()
  set id(userId: string){
    this.userId = userId;
  }

  constructor(private auth: AuthService, private router: Router) {
  }

  public logout(){
    this.router.navigate(['/']).then(r => this.auth.logout());
  }
}
