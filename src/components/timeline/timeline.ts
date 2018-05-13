import { Component, Input } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import { TimelineProvider } from '../../providers/timeline/timeline';
import { AccountProvider } from '../../providers/account/account';
import { Post } from '../../models/post';
import moment from 'moment';


@Component({
  selector: 'timeline',
  templateUrl: 'timeline.html'
})
export class TimelineComponent {

  @Input() timeline: any[];

  
  account: any;

  constructor(
    public navCtrl: NavController,
    private timelineProvider: TimelineProvider,
    private accountProvider : AccountProvider,
    private modalCtrl : ModalController

  ) {
    console.log('Hi');
    
    this.accountProvider.getAccount().subscribe((data) => {
      this.account = data;
      console.log(this.account);
      
    });

    
    console.log(this.timeline);
  }

  ionViewWillEnter() {

    
  }

  like(uid){
    this.timelineProvider.likePost(uid);
  }

  dislike(uid){
    this.timelineProvider.dislikePost(uid);
  }

  addToBookmark(uid){
    this.timelineProvider.addToBookmark(uid);
  }

  removeFromBookmark(uid){
    this.timelineProvider.removeFromBookmark(uid);
  }

  addPost () {
    this.modalCtrl.create('AddPostPage').present();    
  }

  deletePost(postId){
    this.timelineProvider.deletePost(postId);
  }

  getDate(date){
    
    return moment(new Date(date.seconds * 1000)).fromNow();
  }
  
  likeState(likes: any){    
    if(likes){
      if (likes[this.account.uid])
      return true;
    }
    return false;
  }

  bookmarkState(bookmark: any){    
    if(bookmark){
      if (bookmark[this.account.uid])
      return true;
    }
    return false;
  }


  commentState(comments: any){
    if(comments){
      //myArray.map(function(e) { return e.hello; }).indexOf('stevie');
      if (comments.map((e) => e.commentBy).indexOf(this.account.uid) !== -1)
      return true;
    }
    return false;
  }

  comment(postId){
    console.log('PostId.Home', postId);
    this.modalCtrl.create('CommentPostPage', {postId: postId, account: this.account}).present();  
  }

  sharePost(post){
    this.modalCtrl.create('AddPostPage', 
    {
      text: post.text, 
      postOwner: post.user,
      postOwnerId: post.postBy}).present();      
  }

  //Current User Profile
  openProfile(){
    this.modalCtrl.create('ProfilePage').present();

  }

  //Other User Profile
  goToProfile(userId){
    this.modalCtrl.create('ProfilePage', {userId: userId}).present();
  }

}

