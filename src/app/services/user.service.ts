import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  user: any = '';
  userLastLogin: any = {
    date: ''
  }
  authenticationState = new BehaviorSubject(false);

  constructor() { }
  checkUser(){
    return new Observable(observer => {
      let _user = this._getUser();
      if (_user) {
        this.user = _user;
        this.authenticationState.next(true);
        observer.next(_user);
      }else {
        observer.error('user not found!!');
      }
    })
  }  

  /**
   * Get the current user, or simply return
   * `false` if not logged in.
   */  
  current(){
    return !!this.user? this.user : false;
  }

  login(data) {
    console.log('Data: ', data);
    
    let _time = new Date();
    return new Observable( observer => {
      this.user = data;
      
      if(data.rememberUser){
        this._setUser(this.user);
      };
      this.userLastLogin = _time.getHours() + ':' + _time.getMinutes() + ':' + _time.getSeconds() + ' - ' + _time.getDate() + '/' + (_time.getMonth()+1) + '/' + _time.getFullYear();
      console.log("Time: ", this.userLastLogin);
      
      this._setLastLogin(this.userLastLogin);
      this.authenticationState.next(true);
      observer.next();
    });
  }

  logout() {
    return new Observable( observer => {
      this.user = '';
      localStorage.removeItem('USER');
      this.authenticationState.next(false);
      observer.next();
    });
  }

  private _setUser(_user){
    localStorage.setItem('USER', JSON.stringify(_user));
  }
  private _getUser(){
    return JSON.parse(localStorage.getItem('USER'));
  }
  _setLastLogin(_data) {
    localStorage.setItem('LAST_USER_LOGIN', JSON.stringify(_data));
  }
  _getLastLogin() {
    return JSON.parse(localStorage.getItem('LAST_USER_LOGIN'));
  }
}
