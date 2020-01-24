/**
*Ionic 4 Taxi Booking Complete App (https://store.enappd.com/product/taxi-booking-complete-dashboard)
*
* Copyright © 2019-present Enappd. All rights reserved.
*
* This source code is licensed as per the terms found in the
* LICENSE.md file in the root directory of this source tree.
*/


import { Component, OnInit } from '@angular/core';
import { Platform, ActionSheetController, MenuController, AlertController } from '@ionic/angular';
import { IoncabServicesService } from '../ioncab-services.service';
import { SetlocationComponent } from '../setlocation/setlocation.component';
import { EditlocationnComponent } from '../editlocationn/editlocationn.component';
import { AuthService } from '../auth.service';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { UUID } from 'angular2-uuid';
import { UtilService } from '../util.service';
import { StorageService } from '../filestorage.service';
import { FirestoreService } from '../firestore.service';

@Component({
  selector: 'app-profilepage',
  templateUrl: './profilepage.page.html',
  styleUrls: ['./profilepage.page.scss'],
})
export class ProfilepagePage implements OnInit {
  data: { 'name': string; 'dial_code': string; 'code': string; }[];
  public customAlertOptions;
  public user: any;
  constructor(private auth: AuthService,
    public util: UtilService,
    public camera: Camera,
    private actionCtrl: ActionSheetController,
    private storageServ: StorageService,
    private firestore: FirestoreService,
    public serviceProvider: IoncabServicesService) {
    this.data = serviceProvider.country
  }
  ngOnInit() {
    this.user = this.serviceProvider.loggedInUser;
    console.log('user', this.serviceProvider.loggedInUser);
    if (!this.serviceProvider.loggedInUser.name) {
      this.auth.user.subscribe(res => {
        if (res) {
          console.log(res);
          this.user.id = res.uid;
          this.auth.getUser(res.uid).then((user: any) => {
            console.log(user);
            this.serviceProvider.setLoggedInUser(res, user);
          });
        }
      });
    }
  }
  async gotoEdit() {
    const profileModal: any = await this.serviceProvider.cabModal(EditlocationnComponent, '');
    profileModal.present();

  }

  async openActionsheet() {
    const action = await this.actionCtrl.create({
      buttons: [{
        text: 'Take a picture',
        role: 'destructive',
        cssClass: 'buttonCss',
        handler: () => {
          this.openCamera();
        }
      }, {
        text: 'Pick From Gallery',
        handler: () => {
          this.openGallery();
        }
      }, {
        text: 'Cancel',
        role: 'cancel',
        cssClass: 'buttonCss_Cancel',
        handler: () => {

        }
      }]
    });
    await action.present();
  }
  openCamera() {
    const options: CameraOptions = {
      quality: 60,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }
    this.camera.getPicture(options).then((url) => {
      const name = UUID.UUID();
      // let name = url.split('/');
      this.util.makeFileIntoBlob(url, name).then(imageData => {
        this.util.openInfLoader();
        this.storageServ.uploadContent(imageData, name).then(
          success => {
            this.util.closeLoading()
            this.util.presentToast('image uploded', true, 'bottom', 2100);
            console.log('success', success);
            this.serviceProvider.loggedInUser.profileImg = success.url;
          }

        ).catch(err => {
          this.util.closeLoading();
          this.util.presentToast(`${err}`, true, 'bottom', 2100);
          console.log('err', err);
        })
      })
    }).catch(err => { });
  }
  public openGallery() {
    const options: CameraOptions = {
      quality: 60,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
    }
    this.camera.getPicture(options).then((url) => {
      const name = UUID.UUID();
      this.util.makeFileIntoBlob(url, name).then(imageData => {

        this.util.openInfLoader();
        this.storageServ.uploadContent(imageData, name).then(
          success => {
            this.util.closeLoading()
            this.util.presentToast('image uploded', true, 'bottom', 2100);
            console.log('success', success);
            this.serviceProvider.loggedInUser.profileImg = success.url;
          }
        ).catch(err => {
          this.util.closeLoading();
          this.util.presentToast(`${err}`, true, 'bottom', 2100);
          console.log('err', err);
        });
      });
    }).catch(err => {
      console.log('errrrr', err);
    });
  }
  updateProfileDetails() {
    if (!this.user.name) {
      this.util.presentToast('Name cannot be empty', true, 'bottom', 2100);
      return;
    }
    if (!this.user.email) {
      this.util.presentToast('Email cannot be empty', true, 'bottom', 2100);
      return;
    }
    const update = {
      name: this.user.name,
      email: this.user.email,
      phone: `${this.user['area']}-${this.user['phone']}`,
      profileImg: this.user.profileImg
    }
    console.log('id', this.user.id);
    this.firestore.update('customers', this.user.id, update).then(data => {
      console.log(data);
      this.util.presentToast('Profile updated', true, 'bottom', 2100);
    })
  }
}
