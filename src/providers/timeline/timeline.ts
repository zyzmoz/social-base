import { Injectable } from '@angular/core';
import { AlertController } from 'ionic-angular';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { Post } from '../../models/post';
import { ImageProvider } from '../../providers/image/image';

@Injectable()
export class TimelineProvider {

  constructor(
    private afs: AngularFirestore,
    private afa: AngularFireAuth,
    private imageProvider: ImageProvider,
    private alertCtrl: AlertController
  ) {

  }


  addPost(obj: Post) {
    return new Promise((resolve) => {
      const userId = this.afa.auth.currentUser.uid;
      obj.postBy = userId;
      console.log('post', obj);
      this.afs.doc('accounts/' + userId).valueChanges()
        .subscribe(async (user: any) => {
          console.log('post', user);

          obj.user = user.name;
          if (user.photoURL)
            obj.userPhoto = user.photoURL;

          if (obj.photoURL) {
            const photoURL: any = await this.imageProvider.uploadPostPhoto(userId, obj.photoURL);
            obj.photoURL = photoURL;
          }

          this.afs.collection('posts').add(obj)
            .then(res => resolve(res))
            .catch(err => console.log(err));
        })
    });

  }

  sharePost(obj: Post) {
    return new Promise((resolve) => {
      const userId = this.afa.auth.currentUser.uid;
      obj.postBy = userId;
      console.log('post', obj);
      this.afs.doc('accounts/' + userId).valueChanges()
        .subscribe(async (user: any) => {
          console.log('post', user);

          obj.user = user.name;
          if (user.photoURL)
            obj.userPhoto = user.photoURL;

          if (obj.photoURL) {
            const photoURL: any = await this.imageProvider.uploadPostPhoto(userId, obj.photoURL);
            obj.photoURL = photoURL;
          }

          this.afs.collection('posts').add(obj)
            .then(res => resolve(res))
            .catch(err => console.log(err));
        })
    });

  }

  deletePost(postId) {
    //remove image
    this.alertCtrl.create({
      title: "Delete Post",
      subTitle: "Are you sure you want to delete this post?",
      buttons: [
        {
          text: "No",
          handler: () => console.log('cancel')
        },
        {
          text: "Yes",
          handler: () => {
            this.afs.collection('posts').doc(postId).delete()
              .catch(err => console.log(err));
          }
        }

      ]
    }).present();
  }

  async likePost(postId) {
    const userId = this.afa.auth.currentUser.uid;
    let likes: any;
    likes = await new Promise((resolve) => {
      this.afs.doc('posts/' + postId).valueChanges()
        .subscribe((post: any) => {
          let likes = post.likes;
          likes = { [userId]: true, ...likes };
          
          resolve(likes);
        })
    });

    this.afs.doc('posts/' + postId).update({ "likes": likes });
  }

  async dislikePost(postId) {
    const userId = this.afa.auth.currentUser.uid;
    let likes: any;
    likes = await new Promise((resolve) => {
      this.afs.doc('posts/' + postId).valueChanges()
        .subscribe((post: any) => {
          let likes = post.likes;
          delete likes[userId];
          // const index = likes.map(like => like.likedBy).indexOf(userId);
          // console.log(index);
          // likes.splice(index, 1);
          resolve(likes);
        })
    });

    this.afs.doc('posts/' + postId).update({ "likes": likes });
  }

  async addToBookmark(postId) {
    const userId = this.afa.auth.currentUser.uid;
    let bookmark: any;
    bookmark = await new Promise((resolve) => {
      this.afs.doc('posts/' + postId).valueChanges()
        .subscribe((post: any) => {
          let bookmark = post.bookmark;
          bookmark = { [userId]: true, ...bookmark };
          // if (bookmark) {
          //   bookmark.push(userId);
          // } else {
          //   bookmark = [userId];
          // }
          resolve(bookmark);
        })
    });

    this.afs.doc('posts/' + postId).update({ bookmark: bookmark });
  }

  async removeFromBookmark(postId) {
    const userId = this.afa.auth.currentUser.uid;
    let bookmark: any;
    bookmark = await new Promise((resolve) => {
      this.afs.doc('posts/' + postId).valueChanges()
        .subscribe((post: any) => {
          let bookmark = post.bookmark;

          delete bookmark[userId];

          // const index = bookmark.indexOf(userId);
          // console.log(index);
          // bookmark.splice(index, 1);
          resolve(bookmark);
        })
    });

    this.afs.doc('posts/' + postId).update({ bookmark: bookmark });
  }

  async commentPost(postId, obj) {
    const userId = this.afa.auth.currentUser.uid;
    let comments: any;
    comments = await new Promise((resolve) => {
      this.afs.doc('posts/' + postId).valueChanges()
        .subscribe((post: any) => {
          let comments: any;
          if (post)
            comments = post.comments;
          const comment = {
            user: obj.user,
            photoURL: obj.photoURL ? obj.photoURL : null,
            createdAt: obj.createdAt,
            commentBy: obj.commentBy,
            text: obj.text
          };
          if (comments) {
            comments.push(comment);
          } else {
            comments = [comment];
          }
          resolve(comments);
        })
    });

    this.afs.doc('posts/' + postId).update({ comments: comments });
  }



  getAllPosts() {
    return this.afs.collection('posts', ref => ref.orderBy('createdAt', 'desc')).snapshotChanges();
  }

  getUserPosts(userId) {
    return this.afs.collection('posts', ref => ref.where('postBy', '==', userId)).snapshotChanges();
  }

  getLikedPosts(userId) {
    return this.afs.collection('posts', ref => ref.where('likes.' + userId, '==' , true)).snapshotChanges();
  }

  getBookmarkedPosts(userId) {
    return this.afs.collection('posts', ref => ref.where('bookmark.' + userId, '==' , true)).snapshotChanges();

  }

  getPost(postId) {
    return this.afs.collection('posts').doc(postId).valueChanges();
  }




}
