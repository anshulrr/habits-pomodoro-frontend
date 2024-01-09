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
