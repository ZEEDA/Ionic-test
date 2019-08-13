import { Component } from '@angular/core';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  userName: string = '';
  lastTime: string = '';
  constructor(
    private user: UserService
  ) {
    this.userName = user.user.name;
    this.lastTime = this.user._getLastLogin();
  }



}
