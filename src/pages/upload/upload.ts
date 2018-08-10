import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';

import { Camera, CameraOptions } from '@ionic-native/camera';
import { ImagePicker, ImagePickerOptions } from '@ionic-native/image-picker';
import { PostProvider } from '../../providers/post/post';
import { Post } from '../../models/post.model';

@Component({
  selector: 'page-upload',
  templateUrl: 'upload.html',
})
export class UploadPage {

  title: string = '';
  imagePreview: string = '';
  image64: string;

  constructor(
    private viewCtrl: ViewController,
    private camera: Camera,
    private imagePicker: ImagePicker,
    private _postProvider: PostProvider
  ) {
  }

  close() {
    this.viewCtrl.dismiss();
  }

  post() {

    const post: Post = {
      title: this.title.trim()
    }

    this._postProvider.uploadImage(post, this.image64)
          .then(
            () => this.close(),
          )
          .catch( err => console.log(err) );
  }

  selectImage() {

    const options: ImagePickerOptions = {
      quality: 70,
      outputType: 1,
      maximumImagesCount: 1
    };

    this.imagePicker.getPictures(options).then((results) => {

      for (var i = 0; i < results.length; i++) {
          // console.log('Image URI: ' + results[i]);

          this.imagePreview = 'data:image/jpeg;base64,' + results[i];
          this.image64 = results[i];
      }

    }, (err) => {
      console.log('Error: ', err);
    });
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
     this.image64 = imageData;

    }, (err) => {
     console.log('Error: ', err);
    });

  }

}
