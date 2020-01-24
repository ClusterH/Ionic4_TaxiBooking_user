/**
*Ionic 4 Taxi Booking Complete App (https://store.enappd.com/product/taxi-booking-complete-dashboard)
*
* Copyright © 2019-present Enappd. All rights reserved.
*
* This source code is licensed as per the terms found in the
* LICENSE.md file in the root directory of this source tree.
*/


import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { IoncabServicesService } from './ioncab-services.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  public content;
  public appPages = [
    {
      title: 'Home',
      url: '/home',
      icon: 'home',
      image: '../assets/image/images.jpg'
    },
    {
      title: 'Add card',
      url: '/addcard',
      icon: 'cash'
    },
    {
      title: 'History',
      url: '/history',
      icon: 'timer'
    },
    {
      title: 'Notification',
      icon: 'notifications-outline',
      toggle: true
    },
    {
      title: 'Help',
      url: '/list',
      icon: 'help-circle'
    },
    {
      title: 'Logout',
      url: '/home',
      icon: 'log-out'
    }
  ];
  constructor(
    public serviceProvider: IoncabServicesService,
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private auth: AuthService,
    private route: Router
  ) {
    this.initializeApp();
    this.auth.user.subscribe(res => {
      if (res && res.uid) {
        this.auth.getUser(res.uid).then((user: any) => {
          console.log(user);
          this.serviceProvider.setLoggedInUser(res, user);
        });
      }
    });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  logout(page) {
    if (page.title === 'Logout') {
      this.auth.logout().then(res => {
        this.route.navigate(['login']);
      });
    } else {
      this.route.navigate([page.url]);
    }
  }
}
