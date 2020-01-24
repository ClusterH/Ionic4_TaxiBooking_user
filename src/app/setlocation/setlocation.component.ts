/**
*Ionic 4 Taxi Booking Complete App (https://store.enappd.com/product/taxi-booking-complete-dashboard)
*
* Copyright © 2019-present Enappd. All rights reserved.
*
* This source code is licensed as per the terms found in the
* LICENSE.md file in the root directory of this source tree.
*/


import { Component, OnInit, NgZone, Input } from '@angular/core';
import { IoncabServicesService } from '../ioncab-services.service';
import { ModalController, NavParams } from '@ionic/angular';
import { Router } from '@angular/router';
import { google } from '@agm/core/services/google-maps-types';

@Component({
  selector: 'app-setlocation',
  templateUrl: './setlocation.component.html',
  styleUrls: ['./setlocation.component.scss']
})
export class SetlocationComponent implements OnInit {
  searchItem = '';
  autocompleteItems = [];
  public lat: number;
  public lng: number;
  public latitude: number;
  public longitude: number;
  item: any;
  public location;
  @Input() country: string;
  constructor(private __zone: NgZone,
    public serviceProvider: IoncabServicesService,
    public modalCtrl: ModalController,
    public route: Router,
    private navParams: NavParams) {
  }

  ngOnInit() {
  }

  searcOnChnage() {
    if (this.searchItem) {
      const service = new window['google'].maps.places.AutocompleteService();
      service.getPlacePredictions({ input: this.searchItem, componentRestrictions: { country: this.navParams.data.country } }, (predictions, status) => {
        this.autocompleteItems = [];
        this.__zone.run(() => {
          if (predictions != null) {
            predictions.forEach((prediction) => {
              this.autocompleteItems.push(prediction.description);
            });
          }
        });
      });
    }
  }

  dismiss() {
    this.modalCtrl.dismiss();

  }
  chooseItem(e) {
    if (this.serviceProvider.pickupLocation === 'pickup') {
      this.serviceProvider.showpickup = e
      this.serviceProvider.getLatLan(e).subscribe(result => {
        if (result) {
          this.__zone.run(() => {
            this.lat = result.lat();
            this.lng = result.lng();
            this.serviceProvider.originlatitude = this.lat;
            this.serviceProvider.originlongititude = this.lng;

            this.modalCtrl.dismiss();
          })
        }
      }, error => console.log(error),
        () => console.log('pickup completed'))
    }
    if (this.serviceProvider.pickupLocation === 'destination') {
      this.serviceProvider.showdestination = e
      this.serviceProvider.getLatLan(e).subscribe(result => {
        if (result) {
          this.__zone.run(() => {
            this.latitude = result.lat();
            this.longitude = result.lng();
            this.serviceProvider.destinationlatitude = this.latitude;
            this.serviceProvider.destinationlongititude = this.longitude;
            this.modalCtrl.dismiss();
          })
        }
      }, error => console.log(error),
        () => console.log('pickup completed'))
    }
  }
}

