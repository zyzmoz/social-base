import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';

interface Account {
  name: string,
  username: string,
  email: string,
  photoURL: string
}

@Injectable()
export class AccountProvider {  
  account: Observable<Account>;

  constructor(private afs: AngularFirestore, private afa: AngularFireAuth) {
    console.log('Hello AccountProvider Provider');    
  }

  getAccount(){
    const currentUser = this.afa.auth.currentUser.uid;
    const doc : AngularFirestoreDocument<Account> = this.afs.doc('accounts/' + currentUser);        
    return this.account = doc.valueChanges();
  }

  getAccountEmailByUsername(username){
    const currentUser = this.afa.auth.currentUser.uid;
    const doc : AngularFirestoreCollection<Account> = this.afs.collection('accounts', ref => ref.where('username', '==', username));    
    return doc.valueChanges();
  }

  updateAccount(obj:Account){
    const currentUser = this.afa.auth.currentUser.uid;
    const doc : AngularFirestoreDocument<Account> = this.afs.doc('accounts/' + currentUser);    
    return doc.update(obj);    
  }

  

}
