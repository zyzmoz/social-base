import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { AccountProvider } from '../../providers/account/account';
import { TimelineProvider } from '../../providers/timeline/timeline';


@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  private userId: string = null;
  account: any;

  currentUser: any;

  view: string = "posts";

  userTimeline: any[] =[];
  likedTimeline: any[] = [];
  bookmarkedTimeline: any[] = [];

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private accountProvider : AccountProvider,
    private viewCtrl : ViewController,
    private timelineProvider : TimelineProvider
  ) {
    this.userId = this.navParams.get('userId');
    if (!this.userId)
      this.userId = null;

    this.accountProvider.getAccount(this.userId).subscribe((data) => {      
      this.account = data;
    });
    this.view = "posts";

    
    this.accountProvider.getAccount(null).subscribe((data) => {
      this.currentUser = data;
    });
    console.log('User', this.userId);
    
  }

  followingStatus(){
    if (this.currentUser.following){
      if (this.currentUser.following[this.account.uid])
        return true;
    }
    return false;
  }

  follow(){
    this.accountProvider.follow(this.account.uid);
  }

  unfollow(){
    this.accountProvider.unfollow(this.account.uid);
  }

  ionViewWillEnter() {
    

    this.timelineProvider.getUserPosts(this.userId).subscribe((data) => {
      console.log(data);
      this.userTimeline = [];
      data.map(a => {
        const data = a.payload.doc.data() ;
        const uid = a.payload.doc.id;
        this.userTimeline.push( { uid, ...data });
      });
      
    });

    this.timelineProvider.getLikedPosts(this.userId).subscribe((data) => {      
      this.likedTimeline = [];
      data.map(a => {
        const data = a.payload.doc.data() ;
        const uid = a.payload.doc.id;
        this.likedTimeline.push( { uid, ...data });
      });
      console.log('Liked',this.likedTimeline);     
      
    });

    this.timelineProvider.getBookmarkedPosts(this.userId).subscribe((data) => {      
      this.bookmarkedTimeline = [];
      data.map(a => {
        const data = a.payload.doc.data() ;
        const uid = a.payload.doc.id;
        this.bookmarkedTimeline.push( { uid, ...data });
      });
      console.log('Book',this.bookmarkedTimeline);     
      
    });

    
  }

  following(){
    if (this.account.following)  
      return Object.keys(this.account.following).length;
    return 0;
  }

  followers(){
    if (this.account.followers)
      return Object.keys(this.account.followers).length;
    return 0;
  }

  close() {
    this.viewCtrl.dismiss();
  }

}
