import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

export type RegistrationDto = {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  public register(firstname: string, lastname: string, birthday: string, email: string, password: string){
    return this.http.post<RegistrationDto>("register", {
      firstname: firstname,
      lastname: lastname,
      birthday: birthday,
      email: email,
      password: password,
    });
  }
}
