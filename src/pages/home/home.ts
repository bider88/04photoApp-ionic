import { Component } from '@angular/core';
import { ModalController } from 'ionic-angular';
import { UploadPage } from '../upload/upload';
import { PostProvider } from '../../providers/post/post';
import { Post } from '../../models/post.model';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  posts: Array<Post> = [];

  constructor(
    private modalCtrl: ModalController,
    private _postProvider: PostProvider
  ) {
    this.getPost();
  }

  getPost() {
    this._postProvider.getPosts().subscribe(
      res => {
        this.posts = res;
      },
      err => {
        console.log(err);
      }
    )
  }

  showModal() {

    const modal = this.modalCtrl.create( UploadPage );

    modal.present();
  }

}
