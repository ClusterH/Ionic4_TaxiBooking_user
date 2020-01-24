/**
*Ionic 4 Taxi Booking Complete App (https://store.enappd.com/product/taxi-booking-complete-dashboard)
*
* Copyright © 2019-present Enappd. All rights reserved.
*
* This source code is licensed as per the terms found in the
* LICENSE.md file in the root directory of this source tree.
*/


import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IoncabServicesService } from '../ioncab-services.service';
import { MenuController } from '@ionic/angular';
import { AuthService } from '../auth.service';



@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss']
})
export class RegisterPage implements OnInit {
  public data = [];
  spinner: boolean = false;
  disabled: boolean = false;
  public user = {
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    area: '',
    password: ''
  };
  loader: any;
  public customAlertOptions: any = {
    header: 'Contact Number',
    subHeader: 'Select Area Code',
    translucent: true
  };
  constructor(
    public serviceProvider: IoncabServicesService,
    public menuCtrl: MenuController,
    private auth: AuthService,
    private route: Router,

  ) {
    this.data = serviceProvider.country;
  }

  ngOnInit() {
    this.auth.user.subscribe(res => {
      if (res) {
        this.auth.getUser(res.uid).then((user: any) => {
          console.log(user);
          this.serviceProvider.setLoggedInUser(res, user);
          this.route.navigate(['home']);
        });
      }
    });
  }

  ionViewWillEnter() {
    this.menuCtrl.enable(false);
  }
  ionViewWillLeave() {
    this.menuCtrl.enable(true);
  }

  async registerUser() {
    // const loader = await this.serviceProvider.loading('Register your infomation...');
    // loader.present()
   
    this.auth
      .signupUser(this.user)
      .then(res => {
        console.log(res);
        this.spinner = true;
        this.disabled = true;

        this.auth.getUser(res.uid).then((user: any) => {
          console.log(user);
          this.serviceProvider.setLoggedInUser(res, user);
          this.spinner = false;
          this.disabled = false;

          this.route.navigate(['home'])
        });

      })
      .catch(err => console.log(err.message));
  }

  google_register() {
    this.auth.google_SignupUser().then(() => {
      this.route.navigate(['home']);
    });
  }
0
  facebook_register() {
    this.auth.facebook_SignUser().then(() => {
      this.route.navigate(['home']);
    });
  }
}
