/**
*Ionic 4 Taxi Booking Complete App (https://store.enappd.com/product/taxi-booking-complete-dashboard)
*
* Copyright © 2019-present Enappd. All rights reserved.
*
* This source code is licensed as per the terms found in the
* LICENSE.md file in the root directory of this source tree.
*/



import { Component, OnInit } from '@angular/core';
import { IoncabServicesService } from '../ioncab-services.service';
import { MouseEvent, MapsAPILoader } from '@agm/core';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth.service';
import { FirestoreService } from '../firestore.service';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-requestride',
  templateUrl: './requestride.page.html',
  styleUrls: ['./requestride.page.scss']
})

export class RequestridePage implements OnInit {
  data: {
    iconName: string;
    iconName2: string;
    label: string;
    image: string;
    label2: string;
    text: string;
    text2: string;
    head: string;
  }[];
  public lat: Number;
  public lng: Number;
  public origin: any;
  public destination: any;
  userid: any;
  markers = [];
  zoom: number;
  getData: Promise<void>;

  markerOptions = {
    origin: {
      animation: '\'DROP\'',
      icon: '../../assets/image/origin_marker.png'
    },
    destination: {
      animation: '\'DROP\'',
      icon: '../../assets/image/destination_marker.png',
    }
  };
  renderOptions = {
    suppressMarkers: true,
  };
  
  public screenOptions;
  // scheduleDate = new Date().toISOString();
  checkSchedule: boolean = false;

  constructor(
    public serviceProvider: IoncabServicesService,
    public alertCtrl: AlertController,
    public route: Router,
    private http: HttpClient,
    private auth: AuthService,
    private fire: FirestoreService,
    public loadCtrl: LoadingController,
    public toastController: ToastController,
    private afs:  AngularFirestore,
  ) {
    this.lat = this.serviceProvider.directionlat;
    this.lng = this.serviceProvider.directionlng;
    this.checkSchedule = false;
  }

  ngOnInit() {
    this.auth.user.subscribe(res => {
      console.log(res);
      if (res) {
        this.userid = res.uid;
        this.getDirection();
      // to redirect to further pages if a booking is active
        this.serviceProvider.checkStatus(this.userid).subscribe((result) => {
          if (result) {
            const rideCheck = result['rideOn'];
            if (rideCheck === true) {
              this.route.navigate(['bookingconfirmation']);
            }
          }
        });
      }
      
      this.checkSchedule = false;
    });
  }

  getDirection() {
    if (this.serviceProvider.showpickup === '') {
      this.origin = { lat: this.lat, lng: this.lng };
    } else {
      if (
        this.serviceProvider.originlatitude &&
        this.serviceProvider.originlongititude
      ) {
        this.origin = {
          lat: this.serviceProvider.originlatitude,
          lng: this.serviceProvider.originlongititude
        };
      } else {
        this.origin = { lat: this.lat, lng: this.lng };
      }
      this.destination = {
        lat: this.serviceProvider.destinationlatitude,
        lng: this.serviceProvider.destinationlongititude
      };
    }
  }
  
  async alertOnSubmit() {
    this.checkSchedule = false;
    const alert = await this.alertCtrl.create({
      header: 'Confirm Booking',
      message:
        'Your driver will arrive shortly. Do you want to confirm booking?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: res => {
            console.log('Cancel booking');
            this.serviceProvider.tripStartAddress = null;
            this.serviceProvider.tripEndAddress = null;
            this.route.navigate(['home']);
          }
        },
        {
          text: 'Book',
          handler: () => {
            // this.route.navigate(['bookingconfirmation']);
            this.bookCab(this.checkSchedule);
          }
        }
      ]
    });
    return await alert.present();
  }

  OnSubmitSchedule() {
    this.checkSchedule = true;
  }

  async alertOnSubmitSchedule() {
    if(this.serviceProvider.scheduleDate) {
      const alert = await this.alertCtrl.create({
        header: 'Schedule Booking',
        message:
          'Do you want to confirm Schedule booking?',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'secondary',
            handler: res => {
              console.log('Cancel booking');
              // this.serviceProvider.tripStartAddress = null;
              // this.serviceProvider.tripEndAddress = null;
              // this.serviceProvider.scheduleDate = null;
              this.route.navigate(['home']);
            }
          },
          {
            text: 'Book',
            handler: () => {
              this.bookCab(this.checkSchedule);
            }
          }
        ]
      });
      return await alert.present();
    } else {
      alert("Select Schedule Date!");
    }
  }

  async bookCab(checkschedule: boolean) {
    console.log(checkschedule);
    const loading = await this.loadCtrl.create({
      message: 'Connecting you to drivers ...'
    })
    await loading.present();

    // setTimeout(async () => {
    //   loading.dismiss()
    //   const toast = await this.toastController.create({
    //     message: 'No driver available at this moment',
    //     duration: 2000
    //   });
    //   toast.present()
    // } ,60000)
    let tripInfo = {};
    let obj = {};
    if (checkschedule) {
      console.log(this.serviceProvider.tripStartAddress, this.serviceProvider.tripEndAddress);
      tripInfo = {
        startAddress: this.serviceProvider.tripStartAddress,
        endAddress: this.serviceProvider.tripEndAddress,
        estimateFire: this.serviceProvider.estimateBooking.fare,
        tripDistance: this.serviceProvider.tripDistance,
        tripDuration: this.serviceProvider.tripDuration,
        tripSchedule: this.serviceProvider.scheduleDate,
      }

      obj = {
        origin:  this.origin,
        destination: this.destination,
        uid: this.userid,
        driver_email: this.serviceProvider.estimateBooking.driver_id,
        scheduleAvailable: checkschedule,
        scheduleDate: this.serviceProvider.scheduleDate
      };
      console.log(tripInfo);
      this.fire.update('customers', this.userid, tripInfo).then(async res=> {
        console.log(res);
        console.log(tripInfo);
        console.log(obj);
      });
    } else {
      tripInfo = {
        startAddress: this.serviceProvider.tripStartAddress,
        endAddress: this.serviceProvider.tripEndAddress,
        estimateFire: this.serviceProvider.estimateBooking.fare,
        tripDistance: this.serviceProvider.tripDistance,
        tripDuration: this.serviceProvider.tripDuration,
        scheduleDate: null,
      }

      obj = {
        origin:  this.origin,
        destination: this.destination,
        uid: this.userid,
        driver_email: this.serviceProvider.estimateBooking.driver_id,
        scheduleAvailable: checkschedule,
        scheduleDate: null,
      };

      console.log(tripInfo);
      console.log(obj);

      this.fire.update('customers', this.userid, tripInfo).then(async res=> {
        console.log(res);
        console.log(tripInfo);
      });
    }

    console.log(obj);
    this.http
      .post(
        // 'https://us-central1-iondriverhapp.cloudfunctions.net/',
        'https://us-central1-iondriverhapp.cloudfunctions.net/getDriver',
        obj
      )
      .subscribe(async (res: any) => {
        loading.dismiss();
        console.log('ressssss',res);
        if (res && res.length === 0) {
          const toast = await this.toastController.create({
            message: 'No driver available at this moment',
            duration: 2000
          });
          toast.present()

        } else {
          this.serviceProvider.driverInfo = res;
          console.log('Attempting to book ride with driver ', res)
          this.serviceProvider.customerLocation = obj;
          this.checkSchedule = false;
          this.route.navigate(['bookingconfirmation']);
        }
      });
  }

  dateChanged(event: any) {
    this.serviceProvider.scheduleDate = event.detail.value;
    console.log(this.serviceProvider.scheduleDate);
  }


}
interface marker {
  lat: number;
  lng: number;
  label?: string;
  draggable: boolean;
}
