import 'App.css';
import AppRoutes from 'components/AppRoutes';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {

  registerServiceWorker();

  return (
    <div className="App">
      <AppRoutes />

      <ToastContainer
        position="bottom-right"
        autoClose={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        theme="light"
      />

    </div>
  );
}

function registerServiceWorker() {

  if ("serviceWorker" in navigator) {
    // console.log("Registering service workers...");
    navigator.serviceWorker.register('/firebase-messaging-sw.js')
      .then(registration => {
        // log registration events
        logRegistrationEvent(registration);
        // console.log('Service worker registered with scope:', registration.scope);
      })
      .catch(error => {
        console.error('Service worker registration failed:', error);
      });
  }

  // disabled in mobile device
  // if (navigator?.userAgentData?.mobile) {
  //   return;
  // }
}

// for testing purpose only
function logRegistrationEvent(registration) {
  let serviceWorker;
  if (registration.installing) {
    serviceWorker = registration.installing;
    // console.warn("1. installing");
  } else if (registration.waiting) {
    serviceWorker = registration.waiting;
    // console.warn("2. waiting");
  } else if (registration.active) {
    serviceWorker = registration.active;
    // console.warn("3. active");
  }

  if (serviceWorker) {
    // console.warn("current service worker state: ", serviceWorker.state);
    serviceWorker.addEventListener("statechange", (e) => {
      // console.warn('service worker state: ', e.target.state);
    });
  }
}

export default App;
