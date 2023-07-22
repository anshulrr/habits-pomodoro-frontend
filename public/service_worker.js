console.log("from initialized sw")

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
    self.registration.showNotification(message)
}

// for testing purpose only
var count = 0;
function testTermination() {
    count++;
    setTimeout(() => {
        console.log('from running sw, running since minutes:', count)
        testTermination();
    }, 1000 * 60)
}

testTermination()