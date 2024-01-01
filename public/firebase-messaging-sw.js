// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here. Other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp({
    apiKey: "AIzaSyDSjMRn5lGRPw0YFQsGfVNzzvgSrX9nEGI",
    authDomain: "habits-pomodoro.firebaseapp.com",
    databaseURL: "https://habits-pomodoro.firebaseio.com",
    projectId: "habits-pomodoro",
    storageBucket: "habits-pomodoro.appspot.com",
    messagingSenderId: "531554405931",
    appId: "1:531554405931:web:c2c250a146ac2396d8646e",
    measurementId: "G-4HXN4P76XT"
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log(
        '[firebase-messaging-sw.js] Received background message ',
        payload
    );
    // Customize notification here
    const notificationTitle = 'Background Message Title';
    const notificationOptions = {
        body: 'Background Message body.',
        icon: '/logo192.png'
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});