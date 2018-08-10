import { Injectable } from '@angular/core';

import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import * as firebase from 'firebase';

// import { Observable } from 'rxjs';

import { Post } from '../../models/post.model';

import { LoadingController } from 'ionic-angular';
// import { AuthProvider } from '../auth/auth';

@Injectable()
export class PostProvider {

  private postCollection: AngularFirestoreCollection<Post>;
  posts: Post[] = [];
  lastPost: Date = null;
  uid: string;

  constructor(
    public _afdb: AngularFireDatabase,
    // private _authProvider: AuthProvider,
    private _afs: AngularFirestore,
    public loadingCtrl: LoadingController
  )
  {
    this.loadLastPost();
  }

  private loadLastPost() {

   this._afs.collection<Post>( 'post', ref => ref.limit(1).orderBy('createdAt', 'desc'))
                            .valueChanges().subscribe(
                              post => {
                                this.lastPost = post[0].createdAt;
                                this.posts.push(post[0]);

                                this.loadFourPosts();
                              },
                              err => console.log(err)
                            );

  }

  loadFourPosts() {

    return new Promise( (resolve, reject) => {
      this._afs.collection<Post>( 'post', ref => ref.orderBy('createdAt', 'desc').startAfter(this.lastPost).limit(3) )
                              .valueChanges().subscribe(
                                posts => {

                                  if (posts.length == 0) {
                                    console.log('no hay más registros');
                                    resolve(false);
                                    return;
                                  }

                                  this.lastPost = posts[posts.length - 1].createdAt;

                                  posts.forEach( post => {
                                    this.posts.push(post);
                                  });

                                  resolve(true);
                                },
                                err => console.log(err)
                              );
    })
  }

  getPosts() {
    return this.posts;
  }

  getPost(id) {
    return this._afdb.object(`/post/${id}`);
  }

  createPost(post: Post, url: string) {
    const id = this._afs.createId();
    post.id = id;
    post.image = url;
    // post.user = this.uid;
    post.createdAt = new Date();
    return this.postCollection.doc<Post>(id).set(post);
  }

  uploadImage( post: Post, image: string ) {
    const loader = this.presentLoading('Posteando...');
    loader.present();

    const promise = new Promise( (resolve, reject) =>{
      console.log('Cargando...');

      // Hacemos la referencia al storage
      const storeRef = firebase.storage().ref();

      // Definimos el nombre del archivo
      const fileName: string = new Date().valueOf().toString();

      // Crea la carpeta en el storage
      const uploadTask: firebase.storage.UploadTask = storeRef
                                                        .child(`images/${fileName}`)
                                                        .putString( image, 'base64', { contentType: 'image/jpeg' } ); // Definimos el tipo del archivo

      // Revisa el estado de la carga del archivo
      uploadTask.on( firebase.storage.TaskEvent.STATE_CHANGED,
        // Saber el porcentaje de cuantos Mbs se han subido
        () => {},
        err => {
          console.log('Upload error: ', err);
          reject();
        },
        () => {
          console.log('File uploaded');

          uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
            this.createPost(post, downloadURL);
            loader.dismiss();
          });
          resolve();
        }
      )
    })

    return promise;
  }

  presentLoading(content: string = 'Cargando...') {
    return this.loadingCtrl.create({
      content
    });
  }

}
