/**
*Ionic 4 Taxi Booking Complete App (https://store.enappd.com/product/taxi-booking-complete-dashboard)
*
* Copyright © 2019-present Enappd. All rights reserved.
*
* This source code is licensed as per the terms found in the
* LICENSE.md file in the root directory of this source tree.
*/


import { Component, NgZone, OnInit, ViewChild, ElementRef, OnChanges } from '@angular/core';
import { MouseEvent, MapsAPILoader } from '@agm/core';
import { FormControl } from '@angular/forms';
// import { Observable } from 'rxjs';
// import { ThrowStmt } from '@angular/compiler';
import { IoncabServicesService } from '../ioncab-services.service';
import { ToastController, LoadingController, AlertController, ModalController, NavController } from '@ionic/angular';
import { PaymentPageComponent } from '../payment-page/payment-page.component';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { SetlocationComponent } from '../setlocation/setlocation.component';
import { ActivatedRoute } from '@angular/router';

import { AngularFirestore } from '@angular/fire/firestore';
// import { InfoWindow } from '@agm/core/services/google-maps-types';
import {HttpClient} from '@angular/common/http';


declare var google;
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],

})

export class HomePage implements OnInit {
  @ViewChild('search', { static: false }) searchElementRef: ElementRef;
  public searchControl: FormControl;
  public formatted_address: string;
  public options = {
    suppressMarkers: true,
  };
  public waypoints: any = []
  public show = true;
  zoom: number = 15;
  starsCount: number;
  public lat: number;
  public lng: number;
  public address: Object;
  searchItem = '';
  autocompleteItems = [];
  map: any;
  showpickup = '';
  markers = [];
  street: any;
  building: any;
  public origin: any;
  public destination: any;
  public destination_temp: any = null;
  pickup: boolean;
  loader: any;
  block: any;
  dir: { origin: { lat: number; lng: number; }; destination: { lat: number; lng: number; }; };
  marker: boolean;
  locatedCountry: string;
  tripDistance: string;
  tripDuration: string;
  tripStartAddress: string;
  tripEndAddress: string;
  // estimateTime: { hour: number; min: number }[];
  estimateBooking: { hour: number; min: number; fare: number; member: number; }[];

  public changeLat: number;
  public changeLng: number;

  public markerOptions = {
    origin: {
      animation: '\'DROP\'',
      icon: '../../assets/image/origin_marker.png',
    },
    destination: {
      animation: '\'DROP\'',
      icon: '../../assets/image/destination_marker.png',
    },
  }
  renderOptions = {
    suppressMarkers: true,
  }
  
  renderOptions_driver = {
    polylineOptions: { strokeColor: 'transparent' },
    suppressMarkers: true,
  }
  previous_info_driver;

  slideOpts = {
    slidesPerView: 3,
    freeMode: true,
    coverflowEffect: {
      rotate: 50,
      stretch: 0,
      depth: 100,
      modifier: 1,
      slideShadows: true,
    }
  }

  images = [
    {image: 'assets/image/model/sedan_black.jpg', model: 'SEDAN'},
    {image: 'assets/image/model/suv_black1_720.jpg', model: 'SUV'},
    {image: 'assets/image/model/hatchback_black.jpg', model: 'HATCHBACK'},
    {image: 'assets/image/model/convertible_black1.jpg', model: 'CONVERTIBLE'},
  ]

  driver_position: boolean = false;
  driver_markers: any = [];
  public driver_location : any;
  public markerUrl = '../../assets/image/model/driver_mark3.png';
  public markerUrl_trip = '../../assets/image/marker_pin.png';

  confirm_destination: boolean = false;
  driver_information: any;
  driver_informations: any;

  arriveDistance: any;
  count_num: any = 0;
  temp: any;
  check_distance: boolean = false;
  confirm_moving_map: boolean = false;
  

  constructor(
    private __zone: NgZone,
    public geolocation: Geolocation,
    // private mapsAPILoader: MapsAPILoader,
    public serviceProvider: IoncabServicesService,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public modalCtrl: ModalController,
    public navCtrl: NavController,
    public route: ActivatedRoute,
    private afs: AngularFirestore,
    private http: HttpClient

  ) {
    if (this.serviceProvider.destination === '') {
      this.pickup = false;
      this.marker = true;
    }
    this.getCurrentLoaction();
    this.show = true;
     
    // If redirected from trip page after trip completion
    this.route.params.subscribe(params => {
      console.log(params);
      if (params && params.status == 'complete') {
        this.reset();
      }
    })
  }

  ngOnInit() {
    this.reset();
  }

  reset() {
    this.__zone.run(() => {
      this.marker = true;
      this.destination = null;
      this.serviceProvider.destinationlatitude = null;
      this.serviceProvider.destinationlongititude = null;
      // this.serviceProvider.pickupLocation = 'pickup';
      this.serviceProvider.pickupLocation = 'destination';
      // this.pickup = true;
      this.pickup = false;
      this.serviceProvider.showdestination = null;
      this.origin = null;
      this.serviceProvider.originlatitude = null;
      this.serviceProvider.originlongititude = null;
      this.lat = null;
      this.lng = null;
      this.changeLat = null;
      this.changeLng = null;
      this.driver_position = false;
      this.confirm_destination = false;
      this.destination_temp = null;
      this.tripDistance = null;
      this.tripDuration = null;
      this.tripStartAddress = null;
      this.tripEndAddress = null;
      this.serviceProvider.scheduleDate = null;
      this.serviceProvider.tripDistance = null;
      this.serviceProvider.tripDuration = null;
      this.serviceProvider.tripStartAddress = null;
      this.serviceProvider.tripEndAddress = null;
      this.confirm_moving_map = false;
      this.zoom = 15;
      if(!(this.previous_info_driver == null)) {
        this.previous_info_driver.close();
        this.previous_info_driver = null;
      }
      this.check_distance = false;
      this.getCurrentLoaction();
    })

  }
  // google-api_key: 2019_12_27:  AIzaSyB6nXJq45DT9dEg6Ih29hpnqIjKLL8X9EM

  async getCurrentLoaction() {
    const loader = await this.serviceProvider.loading('Getting your location..');
    loader.present()
    this.geolocation.getCurrentPosition().then((resp) => {
      console.log(resp)
      this.changeLat = resp.coords.latitude
      this.changeLng = resp.coords.longitude
      console.log('changelat:', this.changeLat, 'changelng:', this.changeLng)
      // const latLng = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);
      const latLng = new google.maps.LatLng(this.changeLat, this.changeLng);
      const mapOptions = {
        center: latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }
      this.lat = resp.coords.latitude
      this.lng = resp.coords.longitude
      // this.lat = this.changeLat
      // this.lng = this.changeLng
     
      this.serviceProvider.directionlat = this.lat
      this.serviceProvider.directionlng = this.lng
      // this.map = new google.maps.Map(mapOptions);
      // this.getGeoLocation(resp.coords.latitude, resp.coords.longitude);
      this.getGeoLocation(this.changeLat, this.changeLng);

      // this.serviceProvider.originlatitude = this.lat;
      // this.serviceProvider.originlongititude = this.lng
      this.origin = { lat: this.lat, lng: this.lng };
      // this.origin = { lat: this.serviceProvider.originlatitude, lng: this.serviceProvider.originlongititude };

      loader.dismiss();

    }).catch((error) => {
      console.log('Error getting location', error);
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
            console.log(rsltAdrComponent);
            let local_add_1 = '';
            let local_add_2 = '';
            for (let i = 0; i < rsltAdrComponent.length; i++) {
              if (rsltAdrComponent[i].types && rsltAdrComponent[i].types.includes('country')) {
                this.locatedCountry = rsltAdrComponent[i].short_name;
              }
              if (rsltAdrComponent[i].types && rsltAdrComponent[i].types.includes('administrative_area_level_1')) {
                local_add_1 = rsltAdrComponent[i].short_name;
              }
              if (rsltAdrComponent[i].types && rsltAdrComponent[i].types.includes('locality')) {
                local_add_2 = rsltAdrComponent[i].short_name;
              }
            }
            this.serviceProvider.loggedInUser.location = local_add_1 + ', ' + local_add_2;

            if (this.serviceProvider.flag === true && this.serviceProvider.pickup !== 'US') {
              this.serviceProvider.showpickup = this.block + ' ' + this.street + ' ' + this.building;
            } else if (this.serviceProvider.pickup !== 'US') {
              this.serviceProvider.showdestination = this.street + this.building;
            }
          } else {
            alert('No address available!');
          }
        }
      });
    }
  }
  
  async openImageCtrl(name: any, path: any) {
    this.count_num = 0;
    this.previous_info_driver = null;

    this.driver_information = null;
    if (this.confirm_destination) {
      if (this.serviceProvider.showdestination === '') {
        const toast: any = await this.serviceProvider.presentToast('You must select destination location first to request ride');
        await toast.present();
      } else if (this.serviceProvider.showpickup === '') {
        const toast: any = await this.serviceProvider.presentToast('You must select origin location first to request ride');
        await toast.present();
      } 
      else {
        this.serviceProvider.carname = name;
        this.serviceProvider.path = path;

        let temp = this.afs.collection("drivers", ref=> ref.where("vehicle_info", "==", name)).valueChanges();
        console.log("temp", temp);
        if(temp) {
          this.driver_informations = [];
          this.driver_position = true;
          temp.subscribe((doc: string[]) => {
            console.log("doc", doc);
          
            this.driver_informations = doc;
            console.log("driver_information:", this.driver_informations);
         
            for(let i = 0; i<this.driver_informations.length; i++) {
              this.calculateDistance(this.origin, this.driver_informations[i].location, i);
            }
            
           

            // doc.forEach((item: any) => {
            //   console.log("item", item);
            //   if(item.vehicle_info === name) {
            //     console.log(item.location.lat, item.location.lng);

            //     let driver_location = { lat: Number(item.location.lat), lng: Number(item.location.lng)};

            //     this.driver_information.push({ name: item.name, model: item.vehicle_info, img: item.profileImg, location: driver_location,  phone: item.phone, license: item.license_info, speed: item.speed });
            //     console.log('distance', this.arriveDistance);

            //   }
            // });
            // console.log("driver_information", this.driver_information);
            // console.log('distance', this.arriveDistance);
          });
        } else { alert("Cannot find these models! please choose anothers!"); }
      }
    } else {
      const toast: any = await this.serviceProvider.presentToast('You must select origin/destination location first and press button Done');
          await toast.present();
    }
  }

calculateDistance(origin: any, destination: any, index: number) {
  const directionsService = new google.maps.DirectionsService;
  if(origin && destination && origin.lat && destination.lat) {
      directionsService.route({
          origin,
          destination,
          waypoints: [],
          optimizeWaypoints: true,
          travelMode: 'DRIVING',
          
      }, (response, status) => {
        console.log(response, status);
          if (status === 'OK') {
            let arriDistance = response.routes[0].legs[0].distance.text;
            let arriDuration = response.routes[0].legs[0].duration.text;
            console.log('arri', arriDistance);
            if (Number(arriDistance.split('.')[0]) <= 50) {
              console.log("diddd:", Number(arriDistance.split('.')[0]));
              this.driver_informations[index].distance = arriDistance;
              this.driver_informations[index].duration = arriDuration;
              this.driver_informations[index].check_distance = true;
              console.log(index,  "-index:", this.driver_informations[index].distance);
              this.check_distance = true;
            } 
            
              // directionsRenderer.setDirections(response);
              // If you'll like to display an info window along the route
              // middleStep is used to estimate the midpoint on the route where the info window will appear
              // const middleStep = (response.routes[0].legs[0].steps.length / 2).toFixed();
              // const infowindow2 = new google.maps.InfoWindow();
              // infowindow2.setContent(`${response.routes[0].legs[0].distance.text} <br> ${response.routes[0].legs[0].duration.text}  `);
              // infowindow2.setPosition(response.routes[0].legs[0].steps[middleStep].end_location);
              // infowindow2.open(map);
          } else {
              console.log('Directions request failed due to ' + status);
          }
      });
    } 
}

clickedMarker(infowindow: any) {
  console.log("infowindow", infowindow);
  if (this.previous_info_driver) {
      this.previous_info_driver.close();
      this.previous_info_driver = null;
  };
  this.previous_info_driver = infowindow;
}

confirmCurrentTrip() {
  if(this.origin && this.origin.lat && this.destination_temp && this.destination_temp.lat) {
    this.confirm_destination = true;
    this.destination = this.destination_temp;
    this.marker = false;
    console.log(this.destination);
    this.centerChange(this.destination);
  } else {
    alert("Please select trip");
  }
  
 
}
centerChange(event: any) {
  if (event && !(this.driver_position && this.confirm_destination)) {
    this.changeLat = Number(event.lat);
    this.changeLng = Number(event.lng);
    console.log('ttt:', this.changeLng, this.changeLat)

    const geocoder = new google.maps.Geocoder();
    const latlng = new google.maps.LatLng(this.changeLat, this.changeLng);
    const request = { latLng: latlng };

    geocoder.geocode(request, (results, status) => {
      if (status === google.maps.GeocoderStatus.OK) {
        const result = results[0];
        console.log(result);
        const rsltAdrComponent = result.address_components;
        console.log(rsltAdrComponent);
        if (result !== null) {
          if (rsltAdrComponent[0] !== null) {
            this.block = rsltAdrComponent[0].long_name;
            this.street = rsltAdrComponent[2].short_name;
            this.building = rsltAdrComponent[1].short_name;
          }
          this.__zone.run(() => {
            if (this.serviceProvider.pickupLocation === 'pickup' && !this.confirm_destination) {
              this.serviceProvider.originlatitude = this.changeLat;
              this.serviceProvider.originlongititude = this.changeLng;
              this.origin = { lat: this.serviceProvider.originlatitude, lng: this.serviceProvider.originlongititude };

              this.serviceProvider.showpickup = this.block + ' ' + this.street + ' ' + this.building;
              // this.serviceProvider.showpickup = JSON.stringify(rsltAdrComponent);
            }
            if (this.serviceProvider.pickupLocation === 'destination' && this.confirm_moving_map && !this.confirm_destination ) {
              this.serviceProvider.destinationlatitude = this.changeLat; // service value of destination latitude
              this.serviceProvider.destinationlongititude = this.changeLng; // service value of destination longitude

              // if(this.confirm_destination) {
                this.destination_temp = { lat: this.serviceProvider.destinationlatitude, lng: this.serviceProvider.destinationlongititude }; // local value of destination coords
              // };

              this.serviceProvider.showdestination = this.block + ' ' + this.street + ' ' + this.building;

            } else {
              this.confirm_moving_map = true;

            }
          })

        } else {
          alert('No address available!');
        }

      }
    });
   
  }
}

async gotoEdit(name, value, open) {
  this.serviceProvider.pickupLocation = name;
  if (open === 'modal') {
    this.changeLat = null;
    this.changeLng = null;
    const modal = await this.modalCtrl.create({
      component: SetlocationComponent,
      componentProps: { country: this.locatedCountry ? this.locatedCountry : 'US' }
    });

    await modal.present();
    await modal.onDidDismiss();
    if (this.serviceProvider.showpickup === '') {
      this.origin = { lat: this.lat, lng: this.lng }
    } else {
      this.origin = { lat: this.serviceProvider.originlatitude, lng: this.serviceProvider.originlongititude }
      console.log("origin", this.origin);
      // if (this.serviceProvider.originlatitude && this.serviceProvider.originlongititude) {
        if (this.origin && this.origin.lat && this.origin.lng && (name === 'pickup')) {
          //show in center pick up location
          this.changeLat = this.origin.lat;
          this.changeLng = this.origin.lng;
          console.log("change:", this.changeLat, this.changeLng);
          // this.changeLat = this.serviceProvider.originlatitude;
          // this.changeLng = this.serviceProvider.originlongititude;
          this.lat = this.changeLat;
          this.lng = this.changeLng;
        // }
      } else {
        this.origin = { lat: this.lat, lng: this.lng }
        // this.marker = true;
      }
      this.destination_temp = { lat: this.serviceProvider.destinationlatitude, lng: this.serviceProvider.destinationlongititude }
      console.log(this.destination_temp);
      if (this.destination_temp && this.destination_temp.lat && this.destination_temp.lng && (name==='destination')) {
        // this.destination_temp = { lat: this.destination.lat &&this.destination.lng }
        //show in center destination location
        console.log("destination", this.destination_temp);
        this.changeLat = this.destination_temp.lat;
        this.changeLng = this.destination_temp.lng;
        console.log("change:", this.changeLat, this.changeLng);

        this.lat = this.changeLat;
        this.lng = this.changeLng;
        // this.marker = false;
      } else {
        this.marker = true;
      }
    }
  }
  this.pickup = value
}

public onResponse(event: any) {
  console.log(event);
  this.tripDistance = event.routes[0].legs[0].distance.text;
  this.tripDuration = event.routes[0].legs[0].duration.text;
  this.tripStartAddress = event.routes[0].legs[0].start_address;
  this.tripEndAddress = event.routes[0].legs[0].end_address;
  
  this.serviceProvider.tripDistance  = this.tripDistance.split('k')[0];
  this.serviceProvider.tripDuration = this.tripDuration;
  this.serviceProvider.tripStartAddress = this.tripStartAddress;
  this.serviceProvider.tripEndAddress = this.tripEndAddress;
  console.log(this.serviceProvider.tripStartAddress, this.serviceProvider.tripEndAddress);


  setTimeout(() => {
    this.serviceProvider.tripDistance  = this.tripDistance.split('k')[0];
    
  }, 5000);
}

// public onResponseDriver(event: any) {
//   // this.count++;
//   // console.log("event:"+this.count, event);
//   // if(event.status == "OK") {

//   //   this.driver_informations[this.count].distance = ((event.routes[0].legs[0].distance.text));
//   //   this.driver_informations[this.count].duration = ((event.routes[0].legs[0].duration.text));
    
//   //   // let length = this.driver_information.length;
//   //   // this.driver_information[this.count_num].distance = this.arriveDistance;

//   //   // this.driver_information[this.count_num].hour = Math.floor((this.driver_information[this.count_num].distance/this.driver_information[this.count_num].speed));
//   //   // this.driver_information[this.count_num].min = Math.round((this.arriveDistance - (this.driver_information[this.count_num].hour *  this.driver_information[this.count_num].speed)) * 60/this.driver_information[this.count_num].speed);

//   //   // this.count_num++;
//   //   // this.arriveDistance - arrDis
//   //   // this.arriveDistance.push({distance: arrDis, index: event.index})
//   //   console.log("distance_1:", this.driver_informations.distance);
//   //   console.log("duration:", this.driver_informations.duration);

//   // }
// }

 
  async booking_start(info: any) {
    console.log(info);
    console.log("tripdistance:", this.tripDistance.split('k')[0]);

    this.serviceProvider.estimateBooking = {
      duration: info.duration,
      fare: Number(this.tripDistance.split('k')[0]) * Number(info.price),
      member: info.member,
      driver_id: info.email
    }
    console.log(this.serviceProvider.estimateBooking)
    const profileModal: any = await this.serviceProvider.cabModal(PaymentPageComponent, 'backTransparent');
    profileModal.present();
  }

  
  // mapTypeIdChange($event: MouseEvent) {
  //   console.log($event);
  //   this.confirm_moving_map = true;
  //   // this.markers.push({
  //   //   lat: $event.coords.lat,
  //   //   lng: $event.coords.lng,
  //   //   draggable: true
  //   // });
  // }
 
}

interface marker {
  lat: number;
  lng: number;
  label?: string;
  draggable: boolean;
}


