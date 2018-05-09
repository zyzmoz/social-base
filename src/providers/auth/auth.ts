import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Platform, App, NavController } from 'ionic-angular';
import firebase from 'firebase';

import { AccountProvider } from '../account/account';

import { TabsPage } from '../../pages/tabs/tabs';


@Injectable()
export class AuthProvider {

  private navCtrl: NavController;
  constructor(
    private afa: AngularFireAuth,
    private platform: Platform,
    private app: App,
    private accountProvider: AccountProvider

  ) {
    this.navCtrl = this.app.getRootNav();
    this.afa.authState.subscribe((user) => {
      console.log(user);
      
      if (user){
        this.navCtrl.setRoot(TabsPage);
      } else {
        
      }      
    });    
  }

  signUpWithEmailAndPassword(obj) {
    return this.afa.auth.createUserWithEmailAndPassword(obj.email, obj.password);    
  }

  signUpWithPhoneNumber(obj){
    if (this.platform.is('cordova')){
      // (<any>window).FirebasePlugin.verifyPhoneNumber();
    }    
  }

  resetPassword(user){
    if (!user.includes('@')){
      
      //get email from account collection
    }
    return this.afa.auth.sendPasswordResetEmail(user);
  }

  signInWithEmailAndPassword(obj){
    let { user } = obj;    
    if (!obj.user.includes('@')){
      //get email from account collection
    }
    return this.afa.auth.signInWithEmailAndPassword(obj.user, obj.password);      
  }



}
