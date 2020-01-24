const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors")({ origin: true });

// import * as functions from 'firebase-functions';
// import * as admin from 'firebase-admin';
// import * as cors from 'cors';


admin.initializeApp(functions.config().firebase);
// https://us-central1-iondriverhapp.cloudfunctions.net/getDriver
//https://us-central1-iondriverhapp.cloudfunctions.net/getDriver

exports.getDriver = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    let driverArray = [];
    let data = req.body; // {origin: {}, destination: {}, uid: , driver_email}
    console.log('data');
    console.log(JSON.stringify(data));
    res.setHeader('Access-Control-Allow-Origin', '*');
    admin
      .firestore()
      .collection("drivers")
      .get()
      .then(querySnapshots => {
        querySnapshots.forEach(doc => {
          console.log('driver_id1', doc.data().email);

          if (
            // doc.data().email === 'driver@enappd.com' // You can add a logic to pick driver here, with some algorithm you have
            doc.data().email === data.driver_email // You can add a logic to pick driver here, with some algorithm you have
          ) {
            console.log('driver_id', doc.data().email, 'data.driver_id', data.driver_id);
            let obj = doc.data();
            obj["id"] = doc.id;
            driverArray.push(obj);
          }
        });
        if (driverArray.length) {
          let item = driverArray[0];
          console.log(item);
          // update customer document
          admin
            .firestore()
            .collection("customers")
            .doc(data.uid)
            .update({
              origin: data.origin,
              destination: data.destination,
              rejectRide: false,
              rideOn: false,
              ignoreRide: false
            })// update driver document
            .then(() => {
              admin
                .firestore()
                .collection("drivers")
                .doc(item.id)
                .update({
                  requestRide: true, scheduleRide: data.scheduleAvailable, scheduleDate: data.scheduleDate,
                  requestedUser: data.uid
                }).then(() => {
                  res.send(item);
                })
            })
        } else {
          res.send({ status: 'error' });
        }
      });
  });
});

// https://us-central1-iondriverhapp.cloudfunctions.net/rejectRide
//https://us-central1-iondriverhapp.cloudfunctions.net/rejectRide
exports.rejectRide = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    let uid = req.body.userid;
    let custId = req.body.custId;
    res.setHeader('Access-Control-Allow-Origin', '*');
    admin
      .firestore()
      .collection("drivers")
      .doc(uid)
      .update({
        requestRide: false, scheduleRide: false,
        requestedUser: admin.firestore.FieldValue.delete()
      })
      .then(() => {

        admin
          .firestore()
          .collection("customers")
          .doc(custId)
          .update({
            rejectRide: true,
            rideOn: false,
            startAddress: null,
            endAddress: null,
            estimateFire: null,
            tripDistance: null, tripDuration: null, tripSchedule: null
          })
          .then(doc => {
            res.send({ status: 'done' });
          });
      })
      .catch((err) => {
        res.send({ status: 'error', message: err });
      });
  });
});

// https://us-central1-iondriverhapp.cloudfunctions.net/acceptRide
//https://us-central1-iondriverhapp.cloudfunctions.net/acceptRide
exports.acceptRide = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    let uid = req.body.custId;
    res.setHeader('Access-Control-Allow-Origin', '*');

    // get user info
    admin
      .firestore()
      .collection("customers")
      .doc(uid)
      .update({
        rideOn: true
      })
      .then(() => {
        admin
          .firestore()
          .collection("customers")
          .doc(uid)
          .get()
          .then(doc => {
            res.send(doc.data());
          });
      })
      .catch((err) => {
        res.send({ status: 'error', message: err });
      });
  });
});

exports.drivernotRespond = functions.https.onRequest((req, res) => {
  cors(req, res, () => {

    let driverArray = [];
    let data = req.body;
    console.log('data', data);
    res.setHeader('Access-Control-Allow-Origin', '*');
    admin
      .firestore()
      .collection("drivers")
      .get()
      .then(querySnapshots => {
        querySnapshots.forEach(doc => {
          console.log('doc', doc.data());
          if (
            doc.data().email === data.userid
          ) {
            let obj = doc.data();
            obj["id"] = doc.id;
            driverArray.push(obj);
          }
        });
        console.log('driverArray', driverArray);
        if (driverArray.length) {
          let item = driverArray[0];
          // update customer document
          console.log('item', item);
          admin
            .firestore()
            .collection("customers")
            .doc(data.uid)
            .update({
              rejectRide: false,
              ignoreRide: true,
              rideOn: false,
              startAddress: null,
              endAddress: null,
              estimateFire: null,
              tripDistance: null, tripDuration: null, tripSchedule: null
            }).then(() => {
              console.log('customers data updated on ignore');
              admin
                .firestore()
                .collection("drivers")
                .doc(item.id)
                .update({
                  requestRide: false,scheduleRide: false, scheduleDate: null,
                  requestedUser: admin.firestore.FieldValue.delete()
                }).then(() => {
                  console.log('driver data updated on ignore');
                  res.send({ status: 'ignored' });
                })
            })
        } else {
          res.send({ status: 'error' });
        }
      });
  });
});

// https://us-central1-iondriverhapp.cloudfunctions.net/completeRide
//https://us-central1-iondriverhapp.cloudfunctions.net/completeRide
exports.completeRide = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    let driver = req.body.driverId;
    let customer = req.body.custId;
    let user = req.body.custData;
    // let date = req.body.date;
    let schedule = req.body.scheduleRide;
    let scheduleDate = req.body.scheduleDate;
    res.setHeader('Access-Control-Allow-Origin', '*');
    if ( scheduleDate === null) {
      date = admin.firestore.Timestamp.fromDate(new Date());
    } else {
      date = scheduleDate;
    }
    // update driver
    admin
      .firestore()
      .collection("drivers")
      .doc(driver)
      .update({
        requestRide: false, scheduleRide: false, scheduleDate: null,
        requestedUser: null
      }).then((data) => {
        console.log('driver updated after ride completion');
        console.log(data);
      }).catch((e) => {
        console.log(e);
      });

    // update customer
    admin
      .firestore()
      .collection("customers")
      .doc(customer)
      .update({
        rideOn: false,
        origin: null,
        destination: null,
        startAddress: null,
        endAddress: null,
        estimateFire: null,
        tripDistance: null, tripDuration: null,
        tripSchedule: null
      })
      .then((data) => {
        console.log('customer updated after ride completion');
        console.log(data);
        admin
          .firestore()
          .collection("completedRides")
          .add({
            driver: driver,
            customer: customer,
            fare: user.estimateFire,
            origin: user.origin,
            destination: user.destination,
            startAddress: user.startAddress,
            endAddress: user.endAddress,
            tripDistance: user.tripDistance,
            tripDuration: user.tripDuration,
            date: date,
            schedule: schedule
          })
          .then((ride) => {
            console.log('completedRides updated after ride completion');
            console.log(ride);
            admin
              .firestore()
              .collection("customers")
              .doc(customer)
              .update({
                currentRideID: ride._path.segments[1],
              })
              .then((ok) => {
                res.send({ status: 'done', ride: ok });
              })
          })
          .catch(err => {
            res.send({status:'error', message: err});
          });
      }).catch((e) => {
        console.log(e);
      });
  });
});


exports.addModels = functions.https.onRequest((req, res) => {
  console.log(req);
  cors( req, res, () => {
    // let brand = req.body.brand;
    let model = req.body.model;
    let speed = req.body.speed;
    let price = req.body.price;
    let member = req.body.member;
    let img_path = req.body.img_path;
    res.setHeader('Access-Control-Allow-Origin', '*');
    // res.header('Access-Control-Allow-Headers', true);
    // res.header('Access-Control-Allow-Credentials', true);
    // res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // res.addTrailers(['Access-Control-Allow-Origin', '*', ('Access-Control-Allow-Headers', true)
    
    // add model info
    admin
      .firestore()
      .collection("models")
      .add({
        // brand: brand,
        model: model,
        speed: speed,
        price: price,
        member: member,
        img_path: img_path
      })
      .then((model_info) => {
        console.log('completed add New Model');
        console.log(model_info);
        res.send({ status: 'done' });
      })
      .catch(err => {
        res.send({status:'error', message: err});
      });
  })
 
});


