import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { SignupPage } from '../../pages/signup/signup';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  data: any = {
    user: '',
    password: '',
    message: ''
  }

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private authProvider : AuthProvider

  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  createAccount(){
    this.navCtrl.push(SignupPage);
  }

  async signIn() {
    await this.authProvider.signInWithEmailAndPassword(this.data)
      .catch(e => {
        this.data.message = e.message;
      });
  }

}
