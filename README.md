<<<<<<< HEAD

=======
# ION CAB - Ionic 4 Taxi Booking Complete App

A generic Taxi booking for Taxi Booking.

This is an ionic project for Taxi booking application. You need to have Cordova and Ionic 4.0.0 installed on the 
system to run it successfully

## Using this project

You must have cordova installed prior to this.

```
    $ npm install -g cordova
```


```
    $ npm install -g ionic
```

NOTE: This app is built and tested on 4.0.0.


## Installation of this project

* Extract the zip file you received after purchase

* Install npm dependecies

```
    $ npm install
```

* Install Resources

```
    $ ionic cordova resources
```

* Install Firebase
```
    $ npm install @angular/fire firebase --save
```

* Add Platform (whichever required)

```
    $ ionic cordova platform add android
    $ ionic cordova platform add ios
```
in few cases, you might need to install the latest platform
```
    $ ionic cordova platform add android@latest
    $ ionic cordova platform add ios@latest
```


*Add Firebase config to environments variable

```
    export const environment = {
        production: false,
        firebase: {
            apiKey: '<your-key>',
            authDomain: '<your-project-authdomain>',
            databaseURL: '<your-database-URL>',
            projectId: '<your-project-id>',
            storageBucket: '<your-storage-bucket>',
            messagingSenderId: '<your-messaging-sender-id>'
        }
    };
```

*Add Google Map API key 

1. In the Packag.json file

```

"cordova-plugin-googlemaps": {
        "API_KEY_FOR_ANDROID": "<Google Map API Key>", 
},

```
2. In Config.xml file

```
<preference name="GOOGLE_MAPS_ANDROID_API_KEY" value="<Google Map API Key>" />

<plugin name="cordova-plugin-googlemaps" spec="^2.6.2">
        <variable name="API_KEY_FOR_ANDROID" value="<Google Map API Key>" />
</plugin>

```

        After adding the AngularFireModule you also need to add modules for the individual @NgModules that your application needs.

        AngularFireAuthModule
        AngularFireDatabaseModule
        AngularFireFunctionsModule
        AngularFirestoreModule
        AngularFireStorageModule
        AngularFireMessagingModule

```
* Open the Firebase Console and create a new project.

* In Database section, choose Get Started button for Cloud Firestore.

* Choose Mode

* Click Enable

* Initialize the new git
    ```git init```

* Setup the new git remotes accordingly
    ```git remote add origin new remote```


* Install Plugins (whichever required)

```
    $ ionic cordova plugin add YOUR_PLUGIN_NAME
```


## Plugins List

```
    "cordova-plugin-geolocation",
    "cordova-plugin-device",
    "cordova-plugin-console",
    "cordova-plugin-whitelist",
    "cordova-plugin-splashscreen",
    "cordova-plugin-statusbar",
    "ionic-plugin-keyboard"
```


* Run app on device

```
    $ ionic cordova run android
    $ ionic cordova run ios --device
```

* Create signing key for android to release on Google Play

```
    $ keytool -genkey -v -keystore keystore folder address -alias app alias -keyalg RSA -keysize 2048 -validity 10000
```

* Create release build for Android Play Store

```
    $ ionic cordova build android --release
```

* Sign the ‘unsigned’ APK for upload on Play store

```
    $ jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore .keystore file full path unsigned apk full path app alias
```


* Zipalign to optimize size for play store upload

```
    $ ./zipalign -v 4 signed apk full path path for final APK
``` 
>>>>>>> First Commit
