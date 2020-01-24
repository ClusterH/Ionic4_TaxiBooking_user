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
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-list',
  templateUrl: 'list.page.html',
  styleUrls: ['list.page.scss']
})
export class ListPage implements OnInit {
  private selectedItem: any;
  public items = [];
  constructor(public ioncabservices: IoncabServicesService,public navCtrl:NavController) {
    this.items = this.ioncabservices.icons
  }
  dismiss() {
    this.navCtrl.back();
  }
  ngOnInit() {
  }
}
