import { Component, OnInit } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  proImg: any = '';
  constructor(
    private camera: Camera,
    private sanitization: DomSanitizer
  ) { }

  ngOnInit() {
    this.proImg = !!this._getImage()? 
                  this.sanitization.bypassSecurityTrustUrl(this._getImage())
                  : '/assets/bg.jpg';
  }
  captureImage() {
    const options: CameraOptions = {
      quality: 60,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.CAMERA,
      saveToPhotoAlbum: false
    }
    
    this.camera.getPicture(options).then((imageData) => {
      console.log("Image: ", imageData);
      
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      this.proImg = 'data:image/jpeg;base64,' + imageData;
      this._setImage(this.proImg);
      this.proImg = this.sanitization.bypassSecurityTrustUrl(this.proImg);
    }, (err) => {
      // Handle error
    });    
  }
  getFromGallery() {
    const options: CameraOptions = {
      quality: 60,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      saveToPhotoAlbum: false
    }
    
    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      this.proImg = 'data:image/jpeg;base64,' + imageData;
      this._setImage(this.proImg);
      this.proImg = this.sanitization.bypassSecurityTrustUrl(this.proImg);
    }, (err) => {
      // Handle error
    });
  }
  private _setImage(_img) {
    localStorage.setItem('PRO_IMG', _img);
  }
  private _getImage() {
    return localStorage.getItem('PRO_IMG');
  }
}
