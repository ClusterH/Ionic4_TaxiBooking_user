/**
*Ionic 4 Taxi Booking Complete App (https://store.enappd.com/product/taxi-booking-complete-dashboard)
*
* Copyright © 2019-present Enappd. All rights reserved.
*
* This source code is licensed as per the terms found in the
* LICENSE.md file in the root directory of this source tree.
*/


import { Component, OnInit, NgZone, Input } from '@angular/core';
import { ModalController, NavParams, LoadingController } from '@ionic/angular';
import { IoncabServicesService } from '../ioncab-services.service';
import { MouseEvent, MapsAPILoader } from '@agm/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
declare var google;

@Component({
  selector: 'app-editlocationn',
  templateUrl: './editlocationn.component.html',
  styleUrls: ['./editlocationn.component.scss']
})
export class EditlocationnComponent implements OnInit {
  constructor(
    public modalCtrl: ModalController,
    public __zone: NgZone,
    public serviceProvider: IoncabServicesService,
    public navParams: NavParams,
    public geolocation: Geolocation,
    public __loader: MapsAPILoader,
    public loadingCtrl: LoadingController,


  ) {
    this.getCurrentLoaction();
    // this.lat = this.serviceProvider.lat
    // this.lng = this.serviceProvider.lng
  }
  @Input() value: string
  searchItem = '';
  map: any;
  autocompleteItems = [];
  public lat: number;
  public lng: number;
  public latitude: number;
  public longitude: number;
  item: any;
  zoom: number = 8;
  public location;
  public screenOptions;
  locatedCountry: any;
  directionlat: number;
  directionlng: number;
  block: any;
  street: any;
  building: any;
  flag: boolean;
  pickup: string;
  showpickup: string;
  showdestination: any;
  markers: marker[];
  async getCurrentLoaction() {
    const loader = await this.serviceProvider.loading('Getting your location..');
    loader.present()
    this.geolocation.getCurrentPosition().then((resp) => {
      const latLng = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);
      const mapOptions = {
        center: latLng,
        zoom: 8,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }
      this.lat = resp.coords.latitude
      this.lng = resp.coords.longitude
      this.directionlat = this.lat
      this.directionlng = this.lng
      //  this.map = new google.maps.Map(mapOptions);
      this.getGeoLocation(resp.coords.latitude, resp.coords.longitude);
      loader.dismiss();

    }).catch((error) => {
    }).finally(() => {
    })
  }

  async getGeoLocation(lat: number, lng: number) {
    if (navigator.geolocation) {
      const geocoder = await new google.maps.Geocoder();
      const latlng = await new google.maps.LatLng(lat, lng);
      const request = { latLng: latlng };

      await geocoder.geocode(request, (results, status) => {
        if (status === google.maps.GeocoderStatus.OK) {
          const result = results[0];
          const rsltAdrComponent = result.address_components;
          if (result !== null) {
            if (rsltAdrComponent[0] !== null) {
              this.block = rsltAdrComponent[0].long_name;
              this.street = rsltAdrComponent[2].short_name;
              this.building = rsltAdrComponent[1].short_name;
            }
            // Find out country of geolocation
            for (let i = 0; i < rsltAdrComponent.length; i++) {
              if (rsltAdrComponent[i].types && rsltAdrComponent[i].types.includes('country')) {
                this.locatedCountry = rsltAdrComponent[i].short_name;
              }
            }

            if (this.flag === true && this.pickup !== 'US') {
              this.showpickup = this.block + ' ' + this.street + ' ' + this.building;
            } else if (this.pickup !== 'US') {
              this.showdestination = this.street + this.building;
            }
          } else {
            alert('No address available!');
          }
        }
      });
    }
  }
  searcOnChnage() {
    if (this.searchItem) {
      const service = new window['google'].maps.places.AutocompleteService();
      service.getPlacePredictions({ input: this.searchItem, componentRestrictions: { country: this.serviceProvider.locatedCountry } }, (predictions, status) => {
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
  ngOnInit() {
  }
  dismiss() {
    this.modalCtrl.dismiss();
  }
  chooseItem(e) {
    this.modalCtrl.dismiss();
  }
  clickedMarker(label: string, index: number) {
    console.log(`clicked the marker: ${label || index}`)
  }

  markerDragEnd(m: marker, $event: MouseEvent) {
    console.log('dragEnd', m, $event);
  }
  mapClicked($event: MouseEvent) {
    this.markers.push({
      lat: $event.coords.lat,
      lng: $event.coords.lng,
      draggable: true
    });
  }

}
interface marker {
  lat: number;
  lng: number;
  label?: string;
  draggable: boolean;
}
