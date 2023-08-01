// console.debug("from initialized sw")

var timeout = null;

self.onmessage = (event) => {
    if (timeout !== null) {
        // console.debug('clearing old timeout: ' + timeout + ', for notification, current status:', event.data.status)
        clearTimeout(timeout);
        timeout = null;
    }

    if (event.data.status === 'started') {
        timeout = setTimeout(showNotification, 1000 * event.data.timeRemaining, event.data.task + " has been running for " + event.data.timeRemaining + "s without any change")
    }
}

function showNotification(message) {
    // console.debug('message for notification: ', message)
    self.registration.showNotification(message)
}
