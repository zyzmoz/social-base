import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import { TimelineProvider } from '../../providers/timeline/timeline';
import { AccountProvider } from '../../providers/account/account';
import { Post } from '../../models/post';
import moment from 'moment';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  timeline:any[] = []; //Array<Post>;
  account: any;

  constructor(
    public navCtrl: NavController,
    private timelineProvider: TimelineProvider,
    private accountProvider : AccountProvider,
    private modalCtrl : ModalController

  ) {
    this.accountProvider.getAccount().subscribe((data) => {
      this.account = data;
      console.log(this.account);
      
    });
  }

  ionViewWillEnter() {

    this.timelineProvider.getAllPosts().subscribe((data) => {
      console.log(data);
      this.timeline = [];
      data.map(a => {
        const data = a.payload.doc.data() ;
        const uid = a.payload.doc.id;
        this.timeline.push( { uid, ...data });
      });
      // this.timeline = data;
    });
    console.log(this.timeline);
  }

  like(uid){
    this.timelineProvider.likePost(uid);
  }

  dislike(uid){
    this.timelineProvider.dislikePost(uid);
  }

  addPost () {
    this.modalCtrl.create('AddPostPage').present();    
  }


  getDate(date){
    
    return moment(new Date(date.seconds * 1000)).fromNow();
  }
  
  likeState(likes: any){    
    if(likes){
      if (likes.indexOf(this.account.uid) !== -1)
      return true;
    }
    return false;

  }


}
