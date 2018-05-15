import { Injectable } from '@angular/core';
import { AlertController } from 'ionic-angular';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { Post } from '../../models/post';
import { Notification } from '../../models/notification';
import { ImageProvider } from '../../providers/image/image';

@Injectable()
export class TimelineProvider {

  limit : number = 10;
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

  sharePost(obj: any) {
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

          await this.afs.collection('posts').add(obj)
            .then(res => resolve(res))
            .catch(err => console.log(err));

          this.createNotification(obj.uid, 'shared');
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

    await this.afs.doc('posts/' + postId).update({ "likes": likes });
    this.createNotification(postId, 'liked');

  }

  async dislikePost(postId) {
    const userId = this.afa.auth.currentUser.uid;
    let likes: any;
    likes = await new Promise((resolve) => {
      this.afs.doc('posts/' + postId).valueChanges()
        .subscribe((post: any) => {
          let likes = post.likes;
          delete likes[userId];

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

    await this.afs.doc('posts/' + postId).update({ comments: comments });
    this.createNotification(postId, 'commented');
  }

  //Notifications
  async createNotification(postId, event) {
    const currentUser = this.afa.auth.currentUser.uid;
    let post : any = await new Promise((resolve) => {
      this.afs.doc('posts/' + postId).valueChanges()
        .subscribe(post => resolve(post));
    });

    let user : any = await new Promise((resolve) => {
      this.afs.doc('accounts/' + currentUser).valueChanges()
        .subscribe(user => resolve(user));
    });

    const notification : Notification = {
      event: event,
      userId: currentUser,
      user: user.name,
      userPhoto: user.photoURL,
      owner: post.user,
      postId: postId,
      createdAt: new Date(),
      text: post.text
    }

    await this.afs.collection('notifications').add(notification)
      .catch(err => console.log(err));

  }

  getNotifications() {
    return this.afs.collection('notifications', ref => ref.orderBy('createdAt', 'desc')).valueChanges();
  }



  //Timelines
  getAllPosts() {
    return this.afs.collection('posts', ref => ref.orderBy('createdAt', 'desc')/*.limit(this.limit)*/).snapshotChanges();
  }

  getUserPosts(userId) {
    return this.afs.collection('posts', ref => ref.where('postBy', '==', userId)).snapshotChanges();
  }

  getLikedPosts(userId) {
    return this.afs.collection('posts', ref => ref.where('likes.' + userId, '==', true)).snapshotChanges();
  }

  getBookmarkedPosts(userId) {
    return this.afs.collection('posts', ref => ref.where('bookmark.' + userId, '==', true)).snapshotChanges();

  }

  getFollowingPosts() {
    return this.afs.collection('posts', ref => ref.orderBy('createdAt', 'desc')).snapshotChanges();

  }

  getPost(postId) {
    return this.afs.collection('posts').doc(postId).valueChanges();
  }




}
