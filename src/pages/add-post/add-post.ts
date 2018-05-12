import { Component } from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  AlertController,
  ViewController,
  Platform
} from 'ionic-angular';
import { Camera } from '@ionic-native/camera';
import { LocationProvider } from '../../providers/location/location';
import { TimelineProvider } from '../../providers/timeline/timeline';
import { LoadingProvider } from '../../providers/loading/loading';
import { Post } from '../../models/post';

@IonicPage()
@Component({
  selector: 'page-add-post',
  templateUrl: 'add-post.html',
})
export class AddPostPage {

  image: any = null;
  location: boolean = false;
  text: string = '';
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private camera: Camera,
    private alertCtrl: AlertController,
    private viewCtrl: ViewController,
    private locationProvider: LocationProvider,
    private timelineProvider: TimelineProvider,
    private platform: Platform,
    private loadingProvider : LoadingProvider
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddPostPage');
  }

  close() {
    this.viewCtrl.dismiss();
  }

  chooseImage() {
    // Ask if the user wants to take a photo or choose from photo gallery.
    let alert = this.alertCtrl.create({
      title: 'Select Image',
      message: 'Do you want to take a photo or choose from your photo gallery?',
      buttons: [
        {
          text: 'Cancel',
          handler: data => { }
        },
        {
          text: 'Choose from Gallery',
          handler: () => {

            this.camera.getPicture({
              quality: 50,
              targetWidth: 384,
              targetHeight: 384,
              destinationType: this.camera.DestinationType.DATA_URL,
              encodingType: this.camera.EncodingType.JPEG,
              correctOrientation: true,
              sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
            }).then((imageData) => {
              console.log(imageData);

              this.image = 'data:image/jpeg;base64,' + imageData;
            });
          }
        },
        {
          text: 'Take Photo',
          handler: () => {
            this.camera.getPicture({
              quality: 50,
              targetWidth: 384,
              targetHeight: 384,
              destinationType: this.camera.DestinationType.DATA_URL,
              encodingType: this.camera.EncodingType.JPEG,
              correctOrientation: true,
              sourceType: this.camera.PictureSourceType.CAMERA
            }).then((imageData) => {
              console.log(imageData);

              this.image = 'data:image/jpeg;base64,' + imageData;
            });
          }
        }
      ]
    }).present();
  }


  async post() {
    this.loadingProvider.show();
    let post: Post = {
      user: '',
      userPhoto: '',
      postBy: '',
      createdAt: new Date(),
    }
    //Verify which data will be sent to the collection
    if (this.platform.is('cordova')) {
      const location = await this.locationProvider.getLocation();
      const address: any = await this.locationProvider.getAddress(location);
      if (this.location) {
        post.location = location;
        post.address = address.locality + ", " + address.countryCode;
      }
    }

    if (this.text)
      post.text = this.text;

    if (this.image)
      post.photoURL = this.image;


    console.log(post);
    await this.timelineProvider.addPost(post);
    this.loadingProvider.hide();
    this.viewCtrl.dismiss();

  }

}
