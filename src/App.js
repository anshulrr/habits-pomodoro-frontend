import './App.css';
import AppRoutes from './components/AppRoutes';

function App() {

  if ("serviceWorker" in navigator) {
    // Register a service worker hosted at the root of the
    // site using the default scope.
    console.log("available")

    navigator.serviceWorker.getRegistrations().then(function (registrations) {
      // code to remove registraions after service worker change in a deployment
      for (let registration of registrations) {
        // console.log('unregitering', registration)
        // registration.unregister();
      }
      console.log(registrations.length)

      if (registrations.length === 0) {
        navigator.serviceWorker.register("service_worker.js").then(
          (registration) => {
            console.log("Service worker registration succeeded:", registration);
          },
          (error) => {
            console.error(`Service worker registration failed: ${error}`);
          },
        );
      }

    });

  } else {
    console.error("Service workers are not supported.");
  }

  return (
    <div className="App">
      <AppRoutes />
    </div>
  );
}

export default App;
