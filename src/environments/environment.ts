// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
export const environment = {
  production: false,
  //add your firebase Project configuration
  // Take help from this Blog to setup firbase config:- https://enappd.com/blog/how-to-integrate-firebase-in-ionic-4-apps/23/
  config: {
    apiKey: "AIzaSyASKBCtMHf7sB77qrcZlMDQ2T8zJyiEU94",
    authDomain: "iondriverhapp.firebaseapp.com",
    databaseURL: "https://iondriverhapp.firebaseio.com",
    projectId: "iondriverhapp",
    storageBucket: "iondriverhapp.appspot.com",
    messagingSenderId: "179523170886",
    appId: "1:179523170886:web:cd0f67b3afde2d16ca5047",
    measurementId: "G-BZ9L6KNVP8"
  }
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
