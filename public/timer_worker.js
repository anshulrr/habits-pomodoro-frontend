console.log("from initialized web worker")

var timeout = null;

self.onmessage = (event) => {
    if (timeout !== null) {
        console.log('clearing old timeout for notification')
        clearTimeout(timeout);
    }

    timeout = setTimeout(showNotification, 1000 * event.data.timeRemaining, event.data.status + event.data.timeRemaining)
}

function showNotification(message) {
    console.log('message for notification: ', message)
    new Notification(message)
}