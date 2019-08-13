import { Component, NgZone } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { Platform, NavController, MenuController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  nextLang = '';
  public appPages = [
    {
      title: 'HOME',
      url: '/home',
      icon: 'home',
      access: 'all'
    },
    {
      title: 'CAPTURE',
      url: '/profile',
      icon: 'camera',
      access: 'all'
    },    
    {
      title: 'LOGIN',
      url: '/login',
      icon: 'unlock',
      access: 'guest'
    },
    {
      title: 'LOGOUT',
      url: '/logout',
      icon: 'log-out',
      access: 'user',
      function: 'logout'
    }
  ];
  userName: any = '';
  lastTime: any = '';

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private translate: TranslateService,
    private zone: NgZone,
    private user: UserService,
    private menu: MenuController,
    private navCtrl: NavController,
  ) {
    this.initTranslate();
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      this.user.checkUser().subscribe(
        res => {
          this.navCtrl.navigateRoot(['/home']);
          this.userName = this.user.user.name;
          this.lastTime = this.user._getLastLogin();
        }, err => {
          this.navCtrl.navigateRoot(['/login']);
        }
      );      

      this.user.authenticationState.subscribe(
        res => {
          if (!!res){
            this.userName = this.user.user.name;
            this.lastTime = this.user._getLastLogin();
          } else {
            this.userName = '';
            this.lastTime = this.user._getLastLogin();            
          }
        }
      )
    });
  }

  initTranslate() {
    let _lang = this._getLocalLang();
    if (!!_lang) {
      this.translate.use(_lang);      
    } else {
      this.translate.use('en');
      this._setLocalLang('en');
    }

    if (this.getLang() == 'ar') {
      this.menu.enable(false, 'ltrMenu');
      this.menu.enable(true, 'rtlMenu');      
    }else if (this.getLang() == 'en'){
      this.menu.enable(false, 'rtlMenu');      
      this.menu.enable(true, 'ltrMenu');
    }

    console.log(":: Lang#1", this.getLang());
    
    let $html = document.getElementsByTagName('html')[0];
    $html.classList.add('lang-' + this.translate.currentLang);
    console.log(":: Lang#2", this.getLang());
    this.nextLang = this.getLang() == 'en'? ' العربية': 'English';
    this.translate.onLangChange.subscribe(event => {
      this.zone.run(() => {
        this.nextLang = this.getLang() == 'en'? ' العربية': 'English';
        $html.classList.remove('lang-ar');
        $html.classList.remove('lang-en');
        $html.classList.add('lang-' + event.lang);
        console.log(":: Lang#3", this.getLang());

      });
    });
  } 
  hasLinkAccess(p: any): boolean{
    let access = false;
    if (p.access === 'all') {
      access = true;
    }
    if ( (p.access === 'guest' && !this.isLoggedin()) || (p.access === 'user' && !!this.isLoggedin()) ) {
      access = true;
    }
    return access;
  }
  isLoggedin(){
    return !!this.user.current()? true : false;
  } 
  getLang(){
    return this.translate.currentLang;
  }
  logout(){
    this.user.logout().subscribe(
      res => {
        this.navCtrl.navigateRoot(['/login'],{
          animated: true
        });
      }
    );
  }
  swichLang(){
    if (this.getLang() == 'en') {
      this.translate.use('ar');
      this._setLocalLang('ar');
      this.menu.enable(false, 'ltrMenu');
      this.menu.close('rtlMenu');
      setTimeout(() => {
        this.menu.enable(true, 'rtlMenu');
      }, 100);      
    }else{
      this.translate.use('en');
      this._setLocalLang('en');
      this.menu.enable(false, 'rtlMenu');      
      this.menu.close('ltrMenu');
      setTimeout(() => {
        this.menu.enable(true, 'ltrMenu');
      }, 100);      
    }
  }  
  private _getLocalLang() {
    return localStorage.getItem('LANG');
  }
  private _setLocalLang(_lang) {
    localStorage.setItem('LANG', _lang);
  }
}
