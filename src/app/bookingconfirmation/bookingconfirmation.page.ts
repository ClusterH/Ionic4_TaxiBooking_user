/**
*Ionic 4 Taxi Booking Complete App (https://store.enappd.com/product/taxi-booking-complete-dashboard)
*
* Copyright © 2019-present Enappd. All rights reserved.
*
* This source code is licensed as per the terms found in the
* LICENSE.md file in the root directory of this source tree.
*/

import { Component, OnInit } from '@angular/core';
import { NavController, LoadingController, ToastController, AlertController } from '@ionic/angular';
import { IoncabServicesService } from '../ioncab-services.service';
import { Router } from '@angular/router';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthService } from '../auth.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-bookingconfirmation',
  templateUrl: './bookingconfirmation.page.html',
  styleUrls: ['./bookingconfirmation.page.scss']
})

export class BookingconfirmationPage {
  progress: number = 10;
  userid: any;
  loader: any;
  timeout: any;
  delayAlert: any;
  cancelAlert: any;
  constructor(
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public statusBar: StatusBar,
    public route: Router,
    private http: HttpClient,
    public navCtrl: NavController,
    private auth: AuthService,
    public serviceProvider: IoncabServicesService,
    public loadingCtrl: LoadingController,
  ) {
    this.statusBar.backgroundColorByHexString('#000');
    this.load();
  }

  async load() {
    this.loader = await this.serviceProvider.loading('Waiting for driver response...');
    this.progress = 10;
    await this.loader.present();
    this.auth.user.subscribe(res => {
      if (res) {
        this.userid = res.uid;
        this.checkUserStatus();
      }
    });
    setTimeout(() => {
      this.progress = 20;
    }, 1);
    setTimeout(() => {
      this.progress = 30;
    }, 1000);
    setTimeout(() => {
      this.progress = 40;
    }, 2000);
    setTimeout(() => {
      this.progress = 50;
    }, 3000);
    setTimeout(() => {
      this.progress = 60;
    }, 4000);
    setTimeout(() => {
      this.progress = 70;
    }, 5000);
    setTimeout(() => {
      this.progress = 80;
    }, 6000);
    setTimeout(() => {

    }, 10000);
    setTimeout(() => {

    }, 11000);

  }

  async checkUserStatus() {
    this.serviceProvider.checkStatus(this.userid).subscribe(async res => {
      this.progress = 100;
      console.log(res);
      if (res && res['rideOn'] === true && !this.serviceProvider.schTOPass) {
        clearTimeout(this.timeout);
        this.loader.dismiss();
        this.route.navigate(['pickup']);
      } else if (res['rejectRide']) {
        clearTimeout(this.timeout);
        this.loader.dismiss();
        if (!this.cancelAlert) {
          this.cancelAlert = await this.alertCtrl.create({
            header: 'Sorry',
            message:
              'Driver cancelled your booking',
            buttons: [
              {
                text: 'Ok',
                handler: () => {
                  this.route.navigate(['home']);
                }
              }
            ]
          });
          return await this.cancelAlert.present();
        } 
      }
      else if(res.ignoreRide){
        this.showAlert();
      }
    });
  }

  async showAlert() {
    this.loader.dismiss();
    if (!this.delayAlert) {
      this.delayAlert = await this.alertCtrl.create({
        header: 'Confirm!',
        backdropDismiss: true,
        message: 'Driver is taking longer then ususual! please try again later',
        buttons: [
          {
            text: 'Ok',
            role: 'cancel',
            cssClass: 'secondary',
            handler: async (res) => {
              this.route.navigate(['home']);
              // You can choose to implement a custom logic here
              // If driver is taking longer to respond you can either ask the user to wait
              // OR ask user to cancel the ride
              // If the ride is cancelled, the same should be conveyed to Driver app
              // Because it should happen that the driver accepts the ride after user cancels it
              // For this you'll have to cancel the ride in driver app first, and then cancel the ride in user app
              // You can also implement any other custom solution like
              // - Chat with driver
              // - Call the driver
              // - Call customer support etc.
            }
          }
        ]
      });

      await this.delayAlert.present();
    }
  }
  // go to previous page
  goBack() {
    this.navCtrl.back();
  }
  ionViewWillLeave(){
    this.delayAlert = null;
  }
  
}
