import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { TimelineProvider } from '../../providers/timeline/timeline';
import { AccountProvider } from '../../providers/account/account';
import { Post } from '../../models/post';
import moment from 'moment';


@IonicPage()
@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})
export class SearchPage {

  view: string = "posts";
  searchStr: string = '';

  timeline: any[] = []; //Array<Post>;
  list: any[] = [];

  users: any[] = [];
  userList: any[] = [];

  account: any;

  constructor(
    public navCtrl: NavController,
    private timelineProvider: TimelineProvider,
    private accountProvider: AccountProvider,
    private modalCtrl: ModalController

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
        const data = a.payload.doc.data();
        const uid = a.payload.doc.id;
        this.timeline.push({ uid, ...data });
      });
      this.list = this.timeline;
      // this.timeline = data;
    });

    this.accountProvider.getUsers().subscribe(data => {
      this.userList = data;
      this.users = data;
      console.log(this.users);

    });
    console.log(this.timeline);
  }

  

  
  search(ev: any) {
    this.searchStr = ev.target.value;

    if (this.view === 'posts') {
      if (this.searchStr && this.searchStr.trim() != '') {

        this.timeline = this.list.filter((item) => {
          return (item.text.toLowerCase().indexOf(this.searchStr.toLowerCase()) > -1);
        })
      } else {
        this.timeline = this.list.filter((item) => {
          console.log(item);
          return (item);
        });
      }
    } else {
      if (this.searchStr && this.searchStr.trim() != '') {

        this.users = this.userList.filter((item) => {
          return (item.name.toLowerCase().indexOf(this.searchStr.toLowerCase()) > -1 ||
          item.username.toLowerCase().indexOf(this.searchStr.toLowerCase()) > -1 );
        })
      } else {
        this.users = this.userList.filter((item) => {
          return (item);
        });
      }
    }

  }

  //Other User Profile
  goToProfile(userId){
    this.modalCtrl.create('ProfilePage', {userId: userId}).present();
  }


}
