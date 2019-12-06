import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from './auth-data.model';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token;
  private isAuthenticated : boolean;
  private tokenTimer :any;
  private authStatusListener = new Subject<boolean>();

  constructor(private httpClient : HttpClient, private router : Router) { }

  public getIsAuth() : boolean {
    return this.isAuthenticated;
  }

  getToken(){
    return this.token
  }

  getAuthstatusListener(){
    return this.authStatusListener.asObservable();
  }

  createUser(email:string, password:string){
    const authData :AuthData = {email:email, password :password}
    this.httpClient.post("http://localhost:3000/api/user/signup",authData)
    .subscribe((res)=>{
      console.log(res);
    })
  }

  login(email:string, password:string){
    const authData :AuthData = {email:email, password :password}
    this.httpClient.post<{token:string, expiresIn:number}>("http://localhost:3000/api/user/login",authData)
    .subscribe((res)=>{
      const token = res.token;
      this.token = token;
      if(token){
        const expiresIn = res.expiresIn;
        this.setAuthTimer(expiresIn);
        this.isAuthenticated = true;
        this.authStatusListener.next(true);
        const now = new Date();
        const expirationDate =new Date(now.getTime() + expiresIn * 1000);
        this.saveAuthData(token,expirationDate);
        this.router.navigate(['/']);
      }
    })
  }

autoAuthUser(){
  const authInformation = this.getAuthData();
  const now = new Date();
  const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
  if(expiresIn > 0){
    this.token = authInformation.token;
    this.isAuthenticated = true;
    this.setAuthTimer(expiresIn/1000);
    this.authStatusListener.next(true);
  }
}

  private setAuthTimer(duration:number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000)
  }

  logout(){
    this.token = null;
    this.isAuthenticated = true;
    this.authStatusListener.next(true);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(['/']);
  }

  private saveAuthData(token :string , expirationDate :Date){
    localStorage.setItem("token",token);
    localStorage.setItem("expirationDate",expirationDate.toISOString());
  }
  private clearAuthData(){
    localStorage.removeItem("token");
    localStorage.removeItem("expirationDate");
  }

  private getAuthData(){
    const token = localStorage.getItem("token");
    const expirationDate = localStorage.getItem("expiration");
    if(!token || !expirationDate){
      return;
    }
    return {
      token : token,
      expirationDate : new Date(expirationDate);
    }

  }

}
