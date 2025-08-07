importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging.js');

firebase.initializeApp({
  apiKey: "AIzaSyDGCvXI8h0pUo5uN1Yf6zA4L1K0Z6hN0hM",
  authDomain: "distillerytollkit.firebaseapp.com",
  projectId: "distillerytollkit",
  storageBucket: "distillerytollkit.appspot.com",
  messagingSenderId: "1040177306248",
  appId: "1:1040177306248:web:0b7b2e4b1b2f2e4b1b2f2e",
  measurementId: "G-0B7B2E4B1B2F2E"
});

const messaging = firebase.messaging();
