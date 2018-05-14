import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import moment from 'moment';
import { TimelineProvider } from '../../providers/timeline/timeline';
import { AccountProvider } from '../../providers/account/account';

@IonicPage()
@Component({
  selector: 'page-notifications',
  templateUrl: 'notifications.html',
})
export class NotificationsPage {

  account: any;
  notifications: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private accountProvider: AccountProvider,
    private timelineProvider: TimelineProvider


  ) {
    this.accountProvider.getAccount(null).subscribe((data) => {
      this.account = data;
      console.log(this.account);
    });
  }

  ionViewWillEnter() {
    this.timelineProvider.getNotifications()
      .subscribe(data => {
        this.notifications = data;

      });
  }

  openPost(postId){
    console.log('Opening:', postId);
  }

}
