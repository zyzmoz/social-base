import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {

  data: any = {    
    name: '',
    username: '',
    email: '',
    phone: '',
    photo: null,
    password: '',
    password2: ''
  }

  step: number = 1;

  constructor(public navCtrl: NavController) {
  }

  isValid():boolean{
    const res =  (this.data.name !== '' &&
    this.data.password !== '' &&
    this.data.password === this.data.password2 &&
    (this.data.email !== '' || this.data.phone !== ''));
    return res;
     
  }



  ionViewDidLoad() {
    
  }

}
