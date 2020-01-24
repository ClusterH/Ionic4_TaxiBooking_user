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
import {  Router } from '@angular/router';

@Component({
  selector: 'app-changepayment',
  templateUrl: './changepayment.page.html',
  styleUrls: ['./changepayment.page.scss'],
})
export class ChangepaymentPage implements OnInit {
  totalFare: number;
  
  constructor(public serviceProvider:IoncabServicesService,public route:Router) { }

  ngOnInit() {
    this.totalFare = Math.round(this.serviceProvider.tripDistance * this.serviceProvider.farePerKm)

  }

  submit(){
    this.route.navigate(['addcard'])

  }

}
