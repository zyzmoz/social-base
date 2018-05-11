import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { TimelineProvider } from '../../providers/timeline/timeline';
import { AccountProvider } from '../../providers/account/account';
import { Post } from '../../models/post';


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
    private accountProvider : AccountProvider

  ) {
    this.accountProvider.getAccount().subscribe((data) => {
      this.account = data;
      console.log(this.account);
      
    });
  }

  ionViewWillEnter() {

    this.timelineProvider.getAllPosts().subscribe((data) => {
      console.log(data);
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

  


}
