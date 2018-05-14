import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { ChatProvider } from '../../providers/chat/chat';


@IonicPage()
@Component({
  selector: 'page-messages',
  templateUrl: 'messages.html',
})
export class MessagesPage {


  chats: any[] = [];
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private modalCtrl: ModalController,
    private chatProvider: ChatProvider
  ) {
  }

  ionViewDidEnter() {
    this.chatProvider.getChats().subscribe(data => {
      this.chats = [];
      data.map(a => {
        const data = a.payload.doc.data();
        const uid = a.payload.doc.id;
        this.chats.push({ uid, ...data });
      });
      console.log('Chats', this.chats);
      
    })
  }

  searchUser() {
    this.modalCtrl.create('SearchUserPage').present();
  }


}
