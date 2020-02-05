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
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ViewController } from '@ionic/core';
@Component({
  selector: 'app-payment-page',
  templateUrl: './payment-page.component.html',
  styleUrls: ['./payment-page.component.scss']
})
export class PaymentPageComponent implements OnInit {
  destination: any;
  carName: any;
  constructor(public serviceProvider: IoncabServicesService, public modalCtrl: ModalController, public route: Router) {
  }
  closeModal() {
    this.modalCtrl.dismiss();
  }
  async routeModal() {
    if (this.serviceProvider.showdestination === '' || this.serviceProvider.showpickup === '') {
      this.modalCtrl.dismiss();
      const toast: any = await this.serviceProvider.presentToast('You Must select PickUp / Destination Location First For Estimate Fare');
      await toast.present();
    } else {
      this.modalCtrl.dismiss();
      this.route.navigate(['requestride']);
    }
  }

  ngOnInit() {
    console.log(this.serviceProvider.estimateBooking);
  }
  
}
