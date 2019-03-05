const firebase = require('firebase');
require('firebase/storage')

let config = {
  apiKey: "AIzaSyA4hiYLPs7Sb2663N4e6Onw2E3sTeK-aE0",
  authDomain: "prueba-echo.firebaseapp.com",
  databaseURL: "https://prueba-echo.firebaseio.com",
  projectId: "prueba-echo",
  storageBucket: "prueba-echo.appspot.com",
  messagingSenderId: "178641556901"
}

firebase.initializeApp(config);

const storage = firebase.storage().ref();

module.exports = storage;

console.log('connected');
