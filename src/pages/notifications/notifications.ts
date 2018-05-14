import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
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
    private timelineProvider: TimelineProvider,
    private modalCtrl : ModalController


  ) {
    this.accountProvider.getAccount(null).subscribe((data) => {
      this.account = data;
      console.log(this.account);
    });
  }

  ionViewWillEnter() {
    this.timelineProvider.getNotifications()
      .subscribe((data: any) => {
        this.notifications = [];

        if (this.account.following) {
          this.notifications = data.filter(item => {
            return this.account.following[item.userId] ? item : null
          });
        }
      });
  }

  getDate(date) {

    return moment(new Date(date.seconds * 1000)).fromNow();
  }


  openPost(postId) {
    this.modalCtrl.create('ViewPostPage', {postId: postId}).present();
    console.log('Opening:', postId);
  }

  

}
