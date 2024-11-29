import {Injectable, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map, tap} from 'rxjs';

export type TokenInfo = {
  id: string;
  firstName: string;
  lastName: string;
}

type AuthenticationDto = {
  token: string;
  refreshTokenExpiration: Date;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private ACCESS_TOKEN_KEY = 'token';
  private REFRESH_TOKEN_EXPIRES_KEY = 'refresh_token_expires';

  public user = signal<TokenInfo | null | undefined>(undefined);

  constructor(private http : HttpClient) {
    //TODO: Make test call to check if refresh token is still valid
    const refreshTokenExpired = localStorage.getItem(this.REFRESH_TOKEN_EXPIRES_KEY);
    if(refreshTokenExpired == null || new Date(refreshTokenExpired).getTime() <= new Date().getTime()) {
      this.logout();
    }
    this.updateUserFromLocalStorage();
    window.addEventListener('storage', event => {
      if(event.key == this.ACCESS_TOKEN_KEY){
        this.updateUserFromLocalStorage();
      }
    });
  }

  private getInfosFromToken(token: string) : TokenInfo {
    const payload = token.split('.')[1];
    const decodedPayload = atob(payload);

    const tokenJson = JSON.parse(decodedPayload);
    const id = tokenJson.nameid;
    const firstname = tokenJson.given_name;
    const lastname = tokenJson.family_name;
    return {
      id: id,
      firstName: firstname,
      lastName: lastname,
    }
  }

  private updateUserFromLocalStorage(){
    const token = localStorage.getItem(this.ACCESS_TOKEN_KEY);
    if(token === null){
      this.user.set(null);
      return;
    }

    const jwtInfos = this.getInfosFromToken(token);
    this.user.set(jwtInfos);
  }

  public getAccessToken(){
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  private handleAuthenticationData(data: AuthenticationDto){

    localStorage.setItem(this.ACCESS_TOKEN_KEY, data.token);
    this.updateUserFromLocalStorage();

    data.refreshTokenExpiration = new Date(data.refreshTokenExpiration);
    localStorage.setItem(this.REFRESH_TOKEN_EXPIRES_KEY, data.refreshTokenExpiration.getTime().toString());
  }

  public login(email: string, password: string) {
    return this.http.post<AuthenticationDto>("login", {
      email: email,
      password: password,
    }).pipe(
      tap(data => {
        this.handleAuthenticationData(data);
      }
    ));
  }

  public logout(){
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    this.updateUserFromLocalStorage();
    localStorage.removeItem(this.REFRESH_TOKEN_EXPIRES_KEY);
  }

  public refreshToken(){
    return this.http.post<AuthenticationDto>("refresh", {
      id: this.user()!.id
    }).pipe(
      tap(data => {
        this.handleAuthenticationData(data);
      }),
      map(data => data.token)
    )
  }
}
