/**
*Ionic 4 Taxi Booking Complete App (https://store.enappd.com/product/taxi-booking-complete-dashboard)
*
* Copyright © 2019-present Enappd. All rights reserved.
*
* This source code is licensed as per the terms found in the
* LICENSE.md file in the root directory of this source tree.
*/


import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-addcard',
  templateUrl: './addcard.page.html',
  styleUrls: ['./addcard.page.scss'],
})
export class AddcardPage implements OnInit {
  public binded: any;
  public customYearValues;
  public re = /^(0[1-9]|1[0-2])\/?([0-9]{4}|[0-9]{2})$/;
  constructor(public navCtrl: NavController) {
     
  }
  dismiss() {
    this.navCtrl.back();
  }
  ngOnInit() {
  }
  submit() {
    if (this.re.test(this.binded)) {
      // console.log('shi h')
    } else {
      // console.log('else')
    }
    
  }

  clicked(){

  }

}
