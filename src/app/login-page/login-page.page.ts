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
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular'
import { IoncabServicesService } from '../ioncab-services.service';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
// import { AngularFireAuth } from '@angular/fire/auth';
import { FormGroup, FormBuilder, Validators, FormControl, } from '@angular/forms';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.page.html',
  styleUrls: ['./login-page.page.scss']
})

export class LoginPagePage implements OnInit {
  cabLogin: any = { email: '', password: '' };
  spinner: boolean = false;
  disabled: boolean = false;
  loader: any;
  validations_form: FormGroup;
  errorMessage: string = '';

  constructor(
    public serviceProvider: IoncabServicesService,
    private googlePlus: GooglePlus,
    public menuCtrl: MenuController,
    private auth: AuthService,
    private platform: Platform,
    private route: Router,
    private formBuilder: FormBuilder,

    // private afAuth: AngularFireAuth,
  ) { }

  ngOnInit() {
    this.validations_form = this.formBuilder.group({
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]\@[a-zA-Z0-9-]\.[a-zA-Z0-9-.]\$')
      ])),
      password: new FormControl('', Validators.compose([
        Validators.minLength(5),
        Validators.required
      ])),
    });

    this.auth.user.subscribe(res => {
      if (res && res.uid) {
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

  validation_messages = {
    'email': [
      { type: 'required', message: 'Email is required.' },
      { type: 'pattern', message: 'Please enter a valid email.' }
    ],
    'password': [
      { type: 'required', message: 'Password is required.' },
      { type: 'minlength', message: 'Password must be at least 5 characters long.' }
    ]
  };

  login(value) {
    this.spinner = true;
    this.disabled = true;
    this.auth
      .loginUser(value.email, value.password)
      .then(res => {
        console.log(res);
        this.auth.getUser(res.user.uid).then((user: any) => {
          console.log(user);
          this.serviceProvider.setLoggedInUser(res, user);

          this.spinner = false;
          this.disabled = false;
          this.route.navigate(['home']);
        });
      })
      .catch(err => {
        this.spinner = false;
        this.disabled = false;
        console.log(err.message);
        this.errorMessage = err.message;
      });
  }

  google_login(){
    this.auth.google_SignupUser();
  }
  facebook_login() {
    this.auth.facebook_SignUser();
  }

  
}
