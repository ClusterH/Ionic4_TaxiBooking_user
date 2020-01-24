/**
*Ionic 4 Taxi Booking Complete App (https://store.enappd.com/product/taxi-booking-complete-dashboard)
*
* Copyright © 2019-present Enappd. All rights reserved.
*
* This source code is licensed as per the terms found in the
* LICENSE.md file in the root directory of this source tree.
*/



import { Component, OnInit } from '@angular/core';
import { MenuController,AlertController} from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';

import { AuthService } from '../auth.service';
import { IoncabServicesService } from '../ioncab-services.service';
import { Router } from '@angular/router';



@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.page.html',
  styleUrls: ['./forgotpassword.page.scss'],
})
export class ForgotpasswordPage implements OnInit {
  user_email: any;
  constructor(
    public menuCtrl:MenuController,
    // private auth: AuthService,
    // public serviceProvider: IoncabServicesService,
    private route: Router,
    // private afAuth: AngularFireAuth,
    public alertCtrl: AlertController,
    private authService: AuthService,



  ) { }

  ngOnInit() {
  }
  ionViewWillEnter() {
    this.menuCtrl.enable(false);
  }
  ionViewWillLeave() {
    this.menuCtrl.enable(true);
  }

  recover() {
    this.authService.resetPassword(this.user_email).then(
      async (res) => {
        console.log(res);
        const alert = await this.alertCtrl.create({
          message: 'Check your email for a password reset link',
          buttons: [
            {
              text: 'Ok',
              role: 'cancel',
              handler: () => {
                this.route.navigate(['loginPage']);
              },
            },
          ],
        });
        await alert.present();
      },
      async error => {
        const errorAlert = await this.alertCtrl.create({
          message: error.message,
          buttons: [{ text: 'Ok', role: 'cancel' }],
        });
        await errorAlert.present();
      }
    );
  }
  // recover() {
  //   this.afAuth.auth.sendPasswordResetEmail(this.user_email)
  //   .then(data => {
  //     console.log(data);
  //     this.presentToast('Password reset email sent');
  //     this.route.navigate(['loginPage']);
  //   })
  //   .catch(err => {
  //     console.log(` failed ${err}`);
  //   });
  // }

  // async presentToast(message) {
  //   const toast = await this.toastCtrl.create({
  //     message,
  //     duration: 3000
  //   });
  //   return toast;
  // }
}
