import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';

import { Camera, CameraOptions } from '@ionic-native/camera';

@Component({
  selector: 'page-upload',
  templateUrl: 'upload.html',
})
export class UploadPage {

  title: string;
  imagePreview: string;

  constructor(
    private viewCtrl: ViewController,
    private camera: Camera
  ) {
  }

  close() {
    this.viewCtrl.dismiss();
  }

  showCamera() {
    const options: CameraOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }

    this.camera.getPicture(options).then((imageData) => {

     this.imagePreview = 'data:image/jpeg;base64,' + imageData;

    }, (err) => {
     console.log('Error: ', err);
    });

  }

}
