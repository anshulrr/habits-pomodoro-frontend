// 1.1 Direct imports (Vite/Rollup handles the bundling)
import { precacheAndRoute } from 'workbox-precaching';
import { clientsClaim } from 'workbox-core';

// 1.2 Immediate execution (No 'if' check needed)
clientsClaim();
self.skipWaiting();

// 1.3 The injection point
precacheAndRoute(self.__WB_MANIFEST);

// 2. Firebase service worker

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

// Retrieve an instance of Firebase Messaging so that it can handle background messages.
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    // Customize notification here
    const timestamp = parseInt(payload.data.title);
    const date = new Date(timestamp);
    // const time = date.getHours() + ":" + date.getMinutes();
    const time = date.toTimeString().split(' ')[0].slice(0, 5);

    const notificationTitle = "Due by " + time;
    const notificationOptions = {
        body: payload.data.body,
        icon: '/logo192.png',
        data: { url: 'https://habitspomodoro.in/' },
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener("notificationclick", (event) => {
    event.notification.close();  // Android needs explicit close.

    event.waitUntil(
        clients.matchAll({ includeUncontrolled: true, type: 'window' }).then(windowClients => {
            // Check if there is already a window/tab open with the target URL
            for (var i = 0; i < windowClients.length; i++) {
                var client = windowClients[i];
                // If so, just focus it.
                if (client.url === event.notification.data.url && 'focus' in client) {
                    return client.focus();
                }
            }
            // If not, then open the target URL in a new window/tab.
            if (clients.openWindow) {
                return clients.openWindow(event.notification.data.url);
            }
        })
    );
});


// 3. Notification service worker

// console.debug("from initialized sw")
var timeout = null;

self.onmessage = (event) => {
    if (timeout !== null) {
        // console.debug('clearing old timeout: ' + timeout + ', for notification, current status:', event.data.status)
        clearTimeout(timeout);
        timeout = null;
    }

    if (event.data.status === 'started') {
        timeout = setTimeout(showNotification, 1000 * event.data.timeRemaining, event.data.task)
    }
}

function showNotification(task) {
    // console.debug('task for notification: ', task)
    const notificationTitle = "Pomodoro Finished";
    const notificationOptions = {
        body: task,
        icon: '/logo192.png',
        data: { url: 'https://habitspomodoro.in/' },
    };
    self.registration.showNotification(notificationTitle, notificationOptions)
}

self.addEventListener("notificationclick", (event) => {
    event.notification.close();  // Android needs explicit close.

    event.waitUntil(
        clients.matchAll({ includeUncontrolled: true, type: 'window' }).then(windowClients => {
            // Check if there is already a window/tab open with the target URL
            for (var i = 0; i < windowClients.length; i++) {
                var client = windowClients[i];
                // If so, just focus it.
                if (client.url === event.notification.data.url && 'focus' in client) {
                    return client.focus();
                }
            }
            // If not, then open the target URL in a new window/tab.
            if (clients.openWindow) {
                return clients.openWindow(event.notification.data.url);
            }
        })
    );
});
