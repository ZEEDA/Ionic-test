import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { NavController, ToastController, LoadingController } from '@ionic/angular';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  currentLang;
  rememberUser: boolean = false;
  loginParams = {
    name: '',
    password: ''
  }
  loading: any;
  loginERRs = {
    name: [],
    password: []  }
  loginForm: FormGroup;
  OK_BUTTON = '';
  _loadingMessage = '';
  _Validate_Name = '';
  _Validate_Password = '';
  _Greeting = '';
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private navCtrl: NavController,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private user: UserService,
    private translate: TranslateService
  ) { 
    this.loginForm = this.formBuilder.group({
      name: ['', Validators.compose([Validators.required])],
      password: ['', Validators.compose([Validators.minLength(6), Validators.maxLength(30), Validators.required])],
      rememberUser: [''],
    })    
    translate.get(['OK', 'LOADING_MSG', 'VALIDATE_NAME', 'VALIDATE_PASSWORD', 'GREETING']).subscribe((values) => {
      this.OK_BUTTON = values.OK;
      this._loadingMessage = values.LOADING_MSG;
      this._Validate_Name = values.VALIDATE_NAME;
      this._Validate_Password = values.VALIDATE_PASSWORD;
      this._Greeting = values.GREETING;
    });
    
    translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.OK_BUTTON = translate.instant("OK");
      this._loadingMessage = translate.instant("LOADING_MSG");
      this._Validate_Name = translate.instant("VALIDATE_NAME");
      this._Greeting = translate.instant("GREETING");
      this._Validate_Password = translate.instant("VALIDATE_PASSWORD");
    });    
  }

  ngOnInit() {
    this.currentLang = this.translate.currentLang;
    console.log("@@ Lang: ", this.currentLang);
  }

  doLogin(){
    console.log('__Hi zeeda: ', this.loginParams);
    this.loginERRs.name = [];
    this.loginERRs.password = [];

    let ERR_MSG = '';
    if( !this.loginForm.controls.name.valid )
    {
      ERR_MSG = this._Validate_Name;
      this.loginERRs.name[0] = ERR_MSG; 
      this.showToast(ERR_MSG, 'X', 'red');
      return ;
    }

    if(this.loginForm.controls.password.value.length < 6)
    {
      ERR_MSG = this._Validate_Password;
      this.loginERRs.password[0] = ERR_MSG; 
      this.showToast(ERR_MSG, 'X', 'red');
      return false;
    }
    let params = {
      name: this.loginParams.name,
      password: this.loginParams.password,
      rememberUser: this.rememberUser
    }
    this.user.login(params).subscribe(
      res => {
        this.showToast(this._Greeting+': '+params.name,'X', 'green');
        this.navCtrl.navigateRoot(['/home'], {
          animated: true
        });
      }, err => {
        console.log("Error: ", err);
        this.showToast('Sorry!!: '+err,'X', 'red');
      }
    )
  }
  getLang(){
    return this.translate.currentLang;
  }
  async showToast(_message = '!', _closeText= this.OK_BUTTON, _cssClass= 'dark', _duration = 3000, _position: any = 'bottom')
  {
    this.dismissIfPresented();
    const toast = await this.toastCtrl.create({
      message: _message,
      showCloseButton: true,
      position: _position,
      closeButtonText: _closeText,
      duration: _duration,
      cssClass: _cssClass
    });
    toast.present();
  }  

  async showLoading(loadingMessage = this._loadingMessage)
  {
    this.loading = await this.loadingCtrl.create({
      // spinner: null,
      // duration: 16000,
      message: loadingMessage,
      translucent: true,
      cssClass: 'custom-class custom-loading'
    });
    return await this.loading.present(); 
  }

  dismissIfPresented()
  {
    setTimeout(()=>{
      if (this.loading)
      {
          this.loading.dismiss().catch(() => {});
      }
    });  
  }
}
