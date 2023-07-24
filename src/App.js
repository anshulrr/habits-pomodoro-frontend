import './App.css';
import AppRoutes from './components/AppRoutes';

function App() {

  registerServiceWorker();

  return (
    <div className="App">
      <AppRoutes />
    </div>
  );
}

function registerServiceWorker() {

  // disabled in mobile device
  if (navigator.userAgentData.mobile) {
    return;
  }

  if ("serviceWorker" in navigator) {
    // Register a service worker hosted at the root of the
    // site using the default scope.
    console.log("available")

    navigator.serviceWorker.register("service_worker.js").then(
      (registration) => {
        // log registration events
        logRegistrationEvent(registration);
        console.log("Service worker registration succeeded:", registration);
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
    console.log("1. installing");
  } else if (registration.waiting) {
    serviceWorker = registration.waiting;
    console.log("2. waiting");
  } else if (registration.active) {
    serviceWorker = registration.active;
    console.log("3. active");
  }

  if (serviceWorker) {
    console.log(serviceWorker.state);
    serviceWorker.addEventListener("statechange", (e) => {
      console.log('service worker state: ', e.target.state);
    });
  }
}

export default App;
