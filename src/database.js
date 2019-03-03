const firebase = require('firebase');

let config = {
  apiKey: "AIzaSyA4hiYLPs7Sb2663N4e6Onw2E3sTeK-aE0",
  authDomain: "prueba-echo.firebaseapp.com",
  databaseURL: "https://prueba-echo.firebaseio.com",
  projectId: "prueba-echo",
  storageBucket: "",
  messagingSenderId: "178641556901"
}

firebase.initializeApp(config);
console.log('connected');
