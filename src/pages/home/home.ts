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
    this.accountProvider.getAccount(null).subscribe((data) => {
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

  addPost () {
    this.modalCtrl.create('AddPostPage').present();    
  }
 

  //Current User Profile
  openProfile(){
    this.modalCtrl.create('ProfilePage', {userId: this.account.uid}).present();

  }

  //Other User Profile
  goToProfile(userId){
    this.modalCtrl.create('ProfilePage', {userId: userId}).present();
  }

}
