import { getToken, onMessage } from "firebase/messaging";
import { storeToken } from "./FirebaseFirestoreService";
import { toast } from 'react-toastify';

const { messaging } = require("./firebaseConfig");

export const getAndStoreNotificationsToken = (userId) => {
    getToken(messaging, { vapidKey: process.env.REACT_APP_FIREBASE_MESSAGING })
        .then((currentToken) => {
            if (currentToken) {
                // Send the token to your server and update the UI if necessary
                // console.log('got the token', { currentToken });
                storeToken(userId, currentToken);
                // ...
            } else {
                // Show permission request UI
                console.log('No registration token available. Request permission to generate one.');
                // ...
            }
        }).catch((err) => {
            console.log('An error occurred while retrieving token. ', err);
            // ...
        });
}

onMessage(messaging, (payload) => {
    // console.log('Message received. ', payload);
    // show toast message

    const timestamp = parseInt(payload.data.title);
    const date = new Date(timestamp);
    const time = date.toTimeString().split(' ')[0].slice(0, 5);

    const notificationTitle = "Due by " + time;

    toast.info(
        <div>
            <small>
                <b>
                    {notificationTitle}
                </b>
                <br />
                {payload.data.body}
            </small>
        </div>
    )
});