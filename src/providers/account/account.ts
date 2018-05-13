import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { Account } from '../../models/account';


@Injectable()
export class AccountProvider {
  account: Observable<Account>;

  constructor(private afs: AngularFirestore, private afa: AngularFireAuth) {
    console.log('Hello AccountProvider Provider');
  }

  getAccount(userId = null) {
    const currentUser = userId ? userId : this.afa.auth.currentUser.uid;
    const doc: AngularFirestoreDocument<Account> = this.afs.doc('accounts/' + currentUser);
    return this.account = doc.valueChanges();
  }

  getUsers() {
    return this.afs.collection('accounts').valueChanges();
  }

  getAccountEmailByUsername(username) {
    const currentUser = this.afa.auth.currentUser.uid;
    const doc: AngularFirestoreCollection<Account> = this.afs.collection('accounts', ref => ref.where('username', '==', username));
    return doc.valueChanges();
  }

  updateAccount(obj: Account) {
    const currentUser = this.afa.auth.currentUser.uid;
    const doc: AngularFirestoreDocument<Account> = this.afs.doc('accounts/' + currentUser);
    return doc.update(obj);
  }

  async follow(userId) {
    const currentUser = this.afa.auth.currentUser.uid;
    let following: any;
    following = await new Promise((resolve) => {
      this.afs.doc('accounts/' + currentUser).valueChanges()
        .subscribe((user: any) => {
          let following = user.following;
          following = { [userId]: true, ...following };

          resolve(following);
        })
    });
    console.log(following);

    this.afs.doc('accounts/' + currentUser).update({ following: following });

    let followers: any;
    followers = await new Promise((resolve) => {
      this.afs.doc('accounts/' + userId).valueChanges()
        .subscribe((user: any) => {
          let followers = user.followers;
          followers = { [currentUser]: true, ...followers };

          resolve(followers);
        })
    });

    this.afs.doc('accounts/' + userId).update({ followers: followers });

  }

  async unfollow(userId) {
    const currentUser = this.afa.auth.currentUser.uid;
    let following: any;
    following = await new Promise((resolve) => {
      this.afs.doc('accounts/' + currentUser).valueChanges()
        .subscribe((user: any) => {
          let following = user.following;
          delete following[userId];

          resolve(following);
        })
    });
    this.afs.doc('accounts/' + currentUser).update({ following: following });
    let followers: any;
    followers = await new Promise((resolve) => {
      this.afs.doc('accounts/' + userId).valueChanges()
        .subscribe((user: any) => {
          let followers = user.followers;
          delete followers[currentUser];

          resolve(followers);
        })
    });

    this.afs.doc('accounts/' + userId).update({ followers: followers });
  }



}
