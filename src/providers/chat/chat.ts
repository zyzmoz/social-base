import { Injectable } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { LoadingProvider } from '../loading/loading';
import { Chat } from '../../models/chat';


@Injectable()
export class ChatProvider {

  constructor(
    private afs: AngularFirestore,
    private afa: AngularFireAuth,
    private loadingProvider : LoadingProvider
  ) {
  }

  async openChat(viewCtrl: ViewController, recipient) {
    console.log('Recipient', recipient);
    
    const currentUser = this.afa.auth.currentUser.uid;
    this.loadingProvider.show();
    let chat: any = await new Promise((resolve) => {
      this.afs.collection('messages', ref => ref
        .where('users.' + recipient.uid , '==', true)
        .where('users.' + currentUser, '==', true))
        .snapshotChanges().subscribe(res => {
          let chat: any[] = [];
          res.map(a => {
            const data = a.payload.doc.data() ;
            const uid = a.payload.doc.id;
            chat.push( { uid, ...data });
          });
          resolve(chat);
        })
    });
    console.log('Chat', chat);
    
    if (chat.length > 0) {
      viewCtrl.dismiss();
      this.loadingProvider.hide();
    } else {
      const newChat : Chat = {
        users: {
          [currentUser]: true,
          [recipient.uid]: true
        },
        recipient: recipient.name,
        recipientPhoto: recipient.photoURL
      }
      await this.afs.collection('messages').add(newChat);     
      viewCtrl.dismiss();
      this.loadingProvider.hide();
    }
  }

  getChats(){
    const currentUser = this.afa.auth.currentUser.uid;
    return this.afs.collection('messages', ref => ref.where('users.'+ currentUser, '==', true )).snapshotChanges()
  }

  isUnread(){
    const currentUser = this.afa.auth.currentUser.uid;
    return this.afs.collection('messages', ref => ref
        .where('users.' + currentUser, '==', true)
        .where('unread', '==', true)).valueChanges();
    
  }



}
