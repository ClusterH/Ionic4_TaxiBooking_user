
/**
*Ionic 4 Taxi Booking Complete App (https://store.enappd.com/product/taxi-booking-complete-dashboard)
*
* Copyright © 2019-present Enappd. All rights reserved.
*
* This source code is licensed as per the terms found in the
* LICENSE.md file in the root directory of this source tree.
*/


import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { IoncabServicesService } from '../ioncab-services.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss']
})
export class LoginPage implements OnInit {
  constructor(
    public serviceProvider: IoncabServicesService,
    public menuCtrl: MenuController,
    private route: Router,
    private auth: AuthService
  ) { }
  ionViewWillEnter() {
    this.menuCtrl.enable(false);
  }
  ionViewWillLeave() {
    this.menuCtrl.enable(true);
  }
  ngOnInit() {
    this.auth.user.subscribe(res => {
      console.log("res", res);
      if (res && res.uid) {
        this.auth.getUser(res.uid).then((user: any) => {
          console.log(user);
          this.serviceProvider.setLoggedInUser(res, user);
          this.route.navigate(['home']);
        });
      }
    });
  }
}
