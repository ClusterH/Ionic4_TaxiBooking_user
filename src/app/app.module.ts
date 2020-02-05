import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { CommonModule } from '@angular/common';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AgmCoreModule } from '@agm/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { PaymentPageComponent } from './payment-page/payment-page.component';
import { SetlocationComponent } from './setlocation/setlocation.component';
import { AgmDirectionModule } from 'agm-direction';
import { EditlocationnComponent } from './editlocationn/editlocationn.component';
import { HttpClientModule } from '@angular/common/http';

import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { environment } from '../environments/environment';
import { Camera } from '@ionic-native/camera/ngx';
import { StorageService } from './filestorage.service';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { FirestoreService } from './firestore.service';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { Facebook } from "@ionic-native/facebook/ngx";
import { DirectionsDirective } from './directions.directive';

@NgModule({
  declarations: [
    AppComponent,
    PaymentPageComponent,
    SetlocationComponent,
    EditlocationnComponent,
    DirectionsDirective
  ],
  entryComponents: [
    PaymentPageComponent,
    SetlocationComponent,
    EditlocationnComponent
  ],
  schemas: [NO_ERRORS_SCHEMA],
  imports: [
    AngularFireStorageModule,
    BrowserModule,
    CommonModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    FormsModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAP_Xy-1QSclKYAvxSmAZO2BuFAWWAlOZQ',
      libraries: ['places', 'geometry']
    }),
    ReactiveFormsModule,
    AgmDirectionModule,
    AngularFireModule.initializeApp(environment.config),
    AngularFireAuthModule,
    AngularFirestoreModule,
    HttpClientModule
  ],
  providers: [
    Camera,
    StorageService,
    StatusBar,
    Geolocation,
    SplashScreen,
    FirestoreService,
    GooglePlus,
    Facebook,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
