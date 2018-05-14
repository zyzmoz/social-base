import { Component, Input } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { TimelineProvider } from '../../providers/timeline/timeline';
import { AccountProvider } from '../../providers/account/account';
import { Post } from '../../models/post';
import moment from 'moment';



@Component({
  selector: 'user-list',
  templateUrl: 'user-list.html'
})

export class UserListComponent {

  @Input() users: any[];

  
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

  followingStatus(userId){
    if (this.account.following){
      if (this.account.following[userId])
        return true;
    }
    return false;
  }

  follow(userId){
    this.accountProvider.follow(userId);
  }

  unfollow(userId){
    this.accountProvider.unfollow(userId);
  }

  //Other User Profile
  goToProfile(userId){
    this.modalCtrl.create('ProfilePage', {userId: userId}).present();
  }


}
