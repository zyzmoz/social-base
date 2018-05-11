import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { Post } from '../../models/post';

@Injectable()
export class TimelineProvider {

  constructor(
    private afs : AngularFirestore,
    private afa : AngularFireAuth
  ) {
    
  }


  addPost(obj : Post){
    //add Image
    return this.afs.collection('posts').add(obj)
      .catch(err => console.log(err));
  }

  deletePost(postId){
    //remove image
    return this.afs.collection('posts').doc(postId).delete()
      .catch(err => console.log(err));
  }

  likePost(postId){
    const userId = this.afa.auth.currentUser.uid;
    return this.afs.doc('posts/'+ postId).set({userId})
      .catch(err => console.log(err));

  }  

  getAllPosts(){
    return this.afs.collection('posts', ref => ref.orderBy('createdAt', 'desc')).snapshotChanges();
  }

}
