import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { BehaviorSubject } from 'rxjs';
import *as firebase from 'firebase';
import { IoncabServicesService } from './ioncab-services.service';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { Facebook, FacebookLoginResponse } from "@ionic-native/facebook/ngx";
import { Platform, AlertController} from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user: BehaviorSubject<any> = new BehaviorSubject<any>('');
  loader: any
  public google_user = {
    display_name: '',
    email: '',
    phone: '',
    area: '',
    password: '',
    profile_img: ''
  };
  constructor(
    private afAuth: AngularFireAuth,
    private db: AngularFirestore,
    private route: Router,
    public serviceProvider: IoncabServicesService,
    private googlePlus: GooglePlus,
    private facebook: Facebook,
    private platform: Platform,
    private AltCtrl: AlertController,

  ) {
    this.checkUser();
  }

  signupUser(user): Promise<any> {
    console.log(user);
    return this.afAuth.auth
      .createUserWithEmailAndPassword(user['email'], user['password'])
      .then(response => {
        const uid = response.user.uid;
        console.log(uid);
        return this.db
          .collection('customers')
          .doc(uid)
          .set({
            name: `${user['first_name']} ${user['last_name']}`,
            email: user['email'],
            phone: `${user['area']}-${user['phone']}`
          });
      });
  }

  loginUser(email: string, password: string): Promise<any> {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password);
  }

  checkUser() {
    this.afAuth.auth.onAuthStateChanged(user => {
      this.user.next(user);
    });
  }

  logout(): Promise<any> {
    return this.afAuth.auth.signOut();
  }

  getUser(uid) {
    console.log(uid);
    const docRef = this.db.collection('customers').doc(uid).ref;
    return new Promise(resolve => {
      const data = docRef.get().then(doc => {
        console.log(doc.data());
        resolve(doc.data());
      }).catch((e) => {
        console.log('error getting document',e);
        resolve(e);
      })
    });
  }

  //  async recoverPwd(email) {
  //   return this.afAuth.auth.sendPasswordResetEmail(email);
  // }
  resetPassword(email:string): Promise<void> {
    return firebase.auth().sendPasswordResetEmail(email);
  }

  async google_SignupUser(){
    if (!this.loader) {
      this.loader = await this.serviceProvider.loading('Loading ...');
      this.loader.present();
    }
    this.googlePlus.login({
      'scopes': '', // optional - space-separated list of scopes, If not included or empty, defaults to `profile` and `email`.
      'webClientId': "179523170886-r3h0ijju35psh93g6csu6bkqsh5ej66e.apps.googleusercontent.com", // optional - clientId of your Web application from Credentials settings of your project - On Android, this MUST be included to get an idToken. On iOS, it is not required.
      'offline': true, // Optional, but requires the webClientId - if set to true the plugin will also return a serverAuthCode, which can be used to grant offline access to a non-Google server
      })
      .then(user => {
        console.log(user);
        const { idToken, accessToken, displayName, email, imageUrl } = user
        this.google_user.display_name = displayName;
        this.google_user.email = email;
        this.google_user.profile_img = imageUrl;
        
        this.onGoogleSignUpSuccess(idToken, accessToken, displayName, email, imageUrl);

        this.loader.dismiss();
      }, err => {
        console.log(err);
        if(!this.platform.is('cordova')){
          console.log("Cordova is not available on desktop. Please try this in a real device or in an emulator.");
        }
        this.loader.dismiss();
      })
  }

  onGoogleSignUpSuccess(accessToken, accessSecret, displayName, email, imageUrl) {
    const credential = accessSecret ? firebase.auth.GoogleAuthProvider
        .credential(accessToken, accessSecret) : firebase.auth.GoogleAuthProvider
            .credential(accessToken);
    this.afAuth.auth.signInWithCredential(credential)
      .then((response) => {
        const uid = response.user.uid;
        return this.db
          .collection('customers')
          .doc(uid)
          .set({
            name: displayName,
            email: email,
            profileImg: imageUrl
          });
      });

  }
  // onLoginError(err) {
  //   console.log(err);
  // }

  async facebook_SignUser(){
    if (!this.loader) {
      this.loader = await this.serviceProvider.loading('Loading ...');
      this.loader.present();
    }
    this.facebook.getLoginStatus().then((res: any) => {
      // if (res.status == 'connected') {
      //   console.log("user connected already" + res.authResponse.accessToken);
      //   this.login_account(res.authResponse, 'fb');

      // }
      // else {
        // console.log("USer Not login ");
        this.facebook.login(['public_profile', 'email']) //, 'user_friends'
          .then((res: FacebookLoginResponse) => {
            this.onFacebookLoginSuccess(res);
            this.presentAlert('Logged into Facebook!' + JSON.stringify(res));
            console.log("successfully login ");
            this.loader.dismiss();
            // this.navController.navigateForward('/slider');
          })
          .catch(e => this.presentAlert('Error logging into Facebook' + JSON.stringify(e)));
          this.loader.dismiss();

      
    }).catch(e => this.presentAlert('Error Check Login Status Facebook' + JSON.stringify(e)));
    this.loader.dismiss();

  }

  // login_account(user_data, type){
  //   if(type == 'fb'){
  //     let facebook_id = user_data.id;
  //     let facebook_email = user_data.email;
  //     let facebook_data = {'facebook_id': facebook_id, 'facebook_email': facebook_email};
  //     this.loader.dismiss();

  //   }

  // }
  onFacebookLoginSuccess(res: FacebookLoginResponse) {
    // const { token, secret } = res;
    const credential = firebase.auth.FacebookAuthProvider.credential(res.authResponse.accessToken);
    this.afAuth.auth.signInWithCredential(credential)
      .then((response) => {
        console.log(response);
        const uid = response.user.uid;
        // this.router.navigate(["/profile"]);
        return this.db
          .collection('customers')
          .doc(uid)
          .set({
            name: response.user.displayName,
            email: response.user.email,
            phone: response.user.phoneNumber,
            profileImg :response.user.photoURL,
            
          });
      })

  }
  onLoginError(err) {
    console.log(err);
  
  }

  async presentAlert(msg) {
    const alert = await this.AltCtrl.create({
       message: msg,
       buttons: ['OK']
     });

    await alert.present();
  }
 
}
