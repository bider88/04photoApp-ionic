import { Injectable } from '@angular/core';

import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';

import { Observable } from 'rxjs';

import { Post } from '../../models/post.model';
// import { AuthProvider } from '../auth/auth';

@Injectable()
export class PostProvider {

  private postCollection: AngularFirestoreCollection<Post>;
  posts: Observable<Post[]>;
  uid: string;

  constructor(
    public _afdb: AngularFireDatabase,
    // private _authProvider: AuthProvider,
    private _afs: AngularFirestore
  ) {
    this.postCollection = this._afs.collection<Post>('post', ref => ref.orderBy('createdAt', 'desc'));
    this.posts = this.postCollection.valueChanges();
  }

  getPosts() {
    return this.posts;
  }

  getPost(id) {
    return this._afdb.object(`/post/${id}`);
  }

  createNote(post: Post) {
    const id = this._afs.createId();
    post.id = id;
    // post.user = this.uid;
    post.createdAt = new Date();
    return this.postCollection.doc<Post>(id).set(post);
  }

}
