import { Injectable } from '@angular/core';
import firebase from 'firebase';
import { Camera } from '@ionic-native/camera';

@Injectable()
export class ImageProvider {

  constructor(
    private camera: Camera) {
    console.log('Hello ImageProvider Provider');
  }
  profilePhotoOptions = {
    quality: 50,
    targetWidth: 384,
    targetHeight: 384,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    correctOrientation: true
  };

  photoMessageOptions = {
    quality: 50,
    targetWidth: 300,
    targetHeight: 200,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    correctOrientation: true,
    allowEdit: true,
  };

  groupPhotoOptions = {
    quality: 50,
    targetWidth: 384,
    targetHeight: 384,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    correctOrientation: true
  };


  // Function to convert dataURI to Blob needed by Firebase
  imgURItoBlob(dataURI) {
    var binary = atob(dataURI.split(',')[1]);
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    var array = [];
    for (var i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], {
      type: mimeString
    });
  }

  // Generate a random filename of length for the image to be uploaded
  generateFilename() {
    var length = 8;
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text + ".jpg";
  }

  uploadProfilePhoto(uid, imageData) {
    return new Promise((resolve, reject) => {
      let imgBlob = this.imgURItoBlob(imageData);
      let metadata = {
        'contentType': imgBlob.type
      };

      firebase.storage().ref().child('images/' + uid + '/' + this.generateFilename()).put(imgBlob, metadata).then((snapshot) => {
        // Delete previous profile photo on Storage if it exists.
        console.log('Snapshot', snapshot);
        // URL of the uploaded image!
        let url = snapshot.metadata.downloadURLs[0];
        console.log('Photo URL', url);
        resolve(url);
      }).catch((error) => {
        console.log('Error.up', error);
        reject(error);
      });

    });
  }


}
