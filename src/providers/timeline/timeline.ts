import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { Post } from '../../models/post';
import { ImageProvider } from '../../providers/image/image';

@Injectable()
export class TimelineProvider {

  constructor(
    private afs : AngularFirestore,
    private afa : AngularFireAuth,
    private imageProvider : ImageProvider
  ) {
    
  }


  addPost(obj : Post){
    return new Promise((resolve) => {
    const userId = this.afa.auth.currentUser.uid;
    obj.postBy = userId;
    console.log('post', obj);
    this.afs.doc('accounts/' + userId).valueChanges()
      .subscribe(async (user: any) => {
        console.log('post', user);
        
        obj.user = user.name;
        if(user.photoURL)
          obj.userPhoto = user.photoURL;    

        if (obj.photoURL){
          const photoURL: any = await this.imageProvider.uploadPostPhoto(userId, obj.photoURL);
          obj.photoURL = photoURL;          
        } 

        this.afs.collection('posts').add(obj)
          .then(res => resolve(res))
          .catch(err => console.log(err));
      })
    });
    
  }

  deletePost(postId){
    //remove image
    return this.afs.collection('posts').doc(postId).delete()
      .catch(err => console.log(err));
  }

  async likePost(postId){
    const userId = this.afa.auth.currentUser.uid;
    let likes: any;
    likes = await new Promise((resolve) => {
     this.afs.doc('posts/'+ postId).valueChanges()
      .subscribe((post:any) => {
        let likes = post.likes;
        if (likes){
          likes.push(userId);
        } else {
          likes = [userId];
        }   
        resolve(likes);     
      })
    });
    
    this.afs.doc('posts/'+ postId).update({likes:likes});
  }  

  async dislikePost(postId){
    const userId = this.afa.auth.currentUser.uid;
    let likes: any;
    likes = await new Promise((resolve) => {
     this.afs.doc('posts/'+ postId).valueChanges()
      .subscribe((post:any) => {
        let likes = post.likes;
        console.log('likes', post);
        
        const index = likes.indexOf(userId);
        console.log(index);        
        likes.splice(index,1);          
        resolve(likes);     
      })
    });
    
    this.afs.doc('posts/'+ postId).update({likes:likes});
  } 

  getAllPosts(){
    return this.afs.collection('posts', ref => ref.orderBy('createdAt', 'desc')).snapshotChanges();
  }

  

}
