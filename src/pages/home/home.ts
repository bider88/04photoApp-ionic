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
  notFinished: boolean = true;

  constructor(
    private modalCtrl: ModalController,
    private _postProvider: PostProvider
  ) {
    this.getPost();
  }

  getPost() {
    this.posts = this._postProvider.getPosts();
  }

  showModal() {

    const modal = this.modalCtrl.create( UploadPage );

    modal.present();
  }

  doInfinite(infiniteScroll) {
    console.log('Begin async operation');

    this._postProvider.loadFourPosts().then(
      (notFinished: boolean) => {
        console.log(notFinished);
        this.notFinished = notFinished;
        infiniteScroll.complete();
      }
    );
  }

}
