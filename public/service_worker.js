console.log("from initialized sw")

var timeout = null;

self.onmessage = (event) => {
    console.log(event.data)
    if (event.data === 'keep alive') {
        return;
    }
    if (timeout !== null) {
        console.log('clearing old timeout: ' + timeout + ', for notification, current status:', event.data.status)
        clearTimeout(timeout);
        timeout = null;
    }

    if (event.data.status === 'started') {
        timeout = setTimeout(showNotification, 1000 * event.data.timeRemaining, event.data.task + " has been running for " + event.data.timeRemaining + "s without any change")
    }
}

function showNotification(message) {
    console.log('message for notification: ', message)
    self.registration.showNotification(message)
}

// for testing purpose only
// running it after every 29 seconds, to avoid termination of the service worker after 30sec
var count = 0;
function testTermination() {
    count += 29;
    setTimeout(() => {
        console.log('from running sw, running for ', Math.floor(count / 60) + "minutes " + count % 60 + "seconds")
        testTermination();
    }, 1000 * 29)
}

testTermination()