/**
*Ionic 4 Taxi Booking Complete App (https://store.enappd.com/product/taxi-booking-complete-dashboard)
*
* Copyright © 2019-present Enappd. All rights reserved.
*
* This source code is licensed as per the terms found in the
* LICENSE.md file in the root directory of this source tree.
*/


import { Component, OnInit, ApplicationRef } from '@angular/core';
import { MouseEvent } from '@agm/core';
import { IoncabServicesService } from '../ioncab-services.service';
import { AuthService } from '../auth.service';
import { FirestoreService } from '../firestore.service';
import { Router, NavigationExtras } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-pickup',
  templateUrl: './pickup.page.html',
  styleUrls: ['./pickup.page.scss']
})
export class PickupPage implements OnInit {
  zoom: number = 8;
  starsCount: number;
  driverInfo: any;
  lat: number;
  lng: number;
  customerInfo: any;
  userid: any;
  markers: marker[];
  public screenOptions;
  origin: { lat: any; lng: any; };
  destination: { lat: any; lng: any; };
  giveRate: boolean = false;
  rating = null;
  completeGiveRate: boolean = false;

  ratingStars = [
    { value: '1', fill: 'star-outline' },
    { value: '2', fill: 'star-outline' },
    { value: '3', fill: 'star-outline' },
    { value: '4', fill: 'star-outline' },
    { value: '5', fill: 'star-outline' }
  ];

  constructor(
    public serviceProvider: IoncabServicesService,
    private auth: AuthService,
    public alertCtrl: AlertController,
    private route: Router,
    private applicationRef: ApplicationRef,
    private firestore: FirestoreService,


  ) {
    this.origin = {
      lat: this.serviceProvider.originlatitude,
      lng: this.serviceProvider.originlongititude
    }
    this.destination = {
      lat: this.serviceProvider.destinationlatitude,
      lng: this.serviceProvider.destinationlongititude
    }
  }
 
  ngOnInit() {
    this.auth.user.subscribe(res => {
      if (res) {
        this.userid = res.uid;
      }
      this.checkUserStatus();
    });
    const driverinfo = this.serviceProvider.driverInfo;
    this.customerInfo = this.serviceProvider.customerLocation;
    this.driverInfo = driverinfo;
    console.log(this.driverInfo);
    this.giveRate = false;
    this.completeGiveRate = false;
    this.rating = null;
  }

  reset() {
    this.giveRate = false;
    this.completeGiveRate = false;
    this.rating = null;
    this.serviceProvider.driverInfo = null;
    this.serviceProvider.customerLocation = null;
  }

  checkUserStatus() {
    this.serviceProvider.checkStatus(this.userid).subscribe(res => {
      //check if the ride is completed, take user to homepage
      if (res && res['rideOn'] === false && this.completeGiveRate === false) {
        this.giveRate = true;
      }
      
      if (this.completeGiveRate === true ) {
        if(!this.serviceProvider.scheduleDate) {
          if (this.rating == null) {
            this.rating = "0";
          }
          let value = { rating: this.rating };
         
          this.firestore.update('completedRides', res['currentRideID'], value).then(data => {
            console.log("data", data);
            // this.rating = null;
          }).catch(err => {
            console.log(err.message);
          });
        }
        this.reset();
        this.route.navigate(['home', 'complete']);
      }
    });
  }

  stars(number) {
    return Array(number).fill(0);
  }

  selectRating(value) {
    this.rating = value;
    console.log(this.rating);
    for (let v of this.ratingStars) {
      if (v.value <= value) v.fill = 'star';
      else v.fill = 'star-outline';
    }
    this.applicationRef.tick();
  }

  // disbaleButton() {
  //   //this.applicationRef.tick();
  //   if (this.rating == null) { return true; }
  //   else { return false; }
  // }

  addComment() {
    this.completeGiveRate = true;
    if (this.completeGiveRate === true) {
      this.checkUserStatus();
    }
  }

  async alertOnSubmit() {
    const alert = await this.alertCtrl.create({
      header: 'Confirm Booking Cancel',
      message:
        'Your driver will arrive shortly. Do you want to confirm booking cancel now?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: res => {
            console.log('Cancel booking');
          }
        },
        {
          text: 'OK',
          handler: () => {
            this.route.navigate(['home']);
          }
        }
      ]
    });
    return await alert.present();
  }
}

interface marker {
  lat: number;
  lng: number;
  label?: string;
  draggable: boolean;
}
