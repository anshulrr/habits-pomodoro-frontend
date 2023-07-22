console.log("from initialized web worker")

var timeout = null;

self.onmessage = (event) => {
    if (timeout !== null) {
        console.log('clearing old timeout: ' + timeout + ', for notification, current status:', event.data.status)
        clearTimeout(timeout);
        timeout = null;
    }

    if (event.data.status === 'started') {
        timeout = setTimeout(showNotification, 1000 * event.data.timeRemaining, event.data.task + " is " + event.data.status + " after " + event.data.timeRemaining + "s")
    }
}

function showNotification(message) {
    console.log('message for notification: ', message)
    new Notification(message)
    postMessage('notification popped')
}