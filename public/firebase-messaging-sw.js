// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here. Other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp({
    apiKey: "AIzaSyDVGCBzniosB6A5fUkV96B2iKSSi-eZnJ8",
    authDomain: "my-project-for-oauth2-3e8ab.firebaseapp.com",
    // databaseURL: "http://my-project-for-oauth2-3e8ab.firebaseio.com",
    projectId: "my-project-for-oauth2-3e8ab",
    storageBucket: "my-project-for-oauth2-3e8ab.appspot.com",
    messagingSenderId: "920538009802",
    appId: "1:920538009802:web:5d94ecc06494720124a433",
    measurementId: "G-L29JR13JHR"
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
        body: payload.notification.body,
        icon: '/logo192.png'
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});