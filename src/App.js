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

  // disabled in mobile device
  if (navigator?.userAgentData?.mobile) {
    return;
  }

  if ("serviceWorker" in navigator) {
    // Register a service worker hosted at the root of the
    // site using the default scope.
    // console.debug("available")

    navigator.serviceWorker.register("service_worker.js").then(
      (registration) => {
        // log registration events
        logRegistrationEvent(registration);
        // console.debug("Service worker registration succeeded");
        // console.debug("registration:", registration);
      },
      (error) => {
        console.error(`Service worker registration failed: ${error}`);
      },
    );

  } else {
    // not supported in http only
    console.error("Service workers are not supported.");
  }
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
