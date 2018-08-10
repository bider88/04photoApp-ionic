import { Component } from '@angular/core';
import { ModalController } from 'ionic-angular';
import { UploadPage } from '../upload/upload';
import { PostProvider } from '../../providers/post/post';
import { Post } from '../../models/post.model';

import { SocialSharing } from '@ionic-native/social-sharing';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  posts: Array<Post> = [];
  notFinished: boolean = true;

  constructor(
    private modalCtrl: ModalController,
    private _postProvider: PostProvider,
    private socialSharing: SocialSharing
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

  share(post: Post) {
    console.log(JSON.stringify(post));
    this.socialSharing.shareViaFacebook(post.title, null, post.image)
    .then(() => {
      // Success!
    }).catch(() => {
      // Error!
    });
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
