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
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-history',
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss']
})
export class HistoryPage implements OnInit {
  // rating: number = 0;
  starsCount: number;
  data = [];
  cid: any;
  rides: any;
  loader: any;
  pastRides: any = [];
  upcomingRides: any = [];
  segmenValue: any;

  constructor(
    public services: IoncabServicesService,
    public route: Router,
    private auth: AuthService,
    private afs: AngularFirestore,
    public serviceProvider: IoncabServicesService
  ) {
    this.data = this.services.cards;
  }
  dismiss() {
    this.route.navigate(['home']);
  }
  ngOnInit() {
    this.auth.user.subscribe(res => {
      console.log(res);
      if (res) {
        this.cid = res.uid;
      }
    });
    this.segmenValue = 'past';
    this.getHistory();
  }

  async getHistory() {
    if (!this.loader) {
      this.loader = await this.serviceProvider.loading('Loading history ...');
      this.loader.present();
    }
    this.afs
      .collection('completedRides', ref =>
        ref.where('customer', '==', `${this.cid}`)
      )
      .valueChanges()
      .subscribe((res: any) => {
        console.log(res);
        if(res){
          for (let i = 0; i < res.length; i++) {
            if(!res[i].schedule) {
              this.pastRides.push(res[i]);
              console.log(res[i]);
            } else {
              this.upcomingRides.push(res[i]);
              console.log(res[i]);
            }
          };
        this.loader.dismiss();
        }
      });
  }

  segmentValue(event: any) {
    this.segmenValue = event.detail.value;
  }
}
