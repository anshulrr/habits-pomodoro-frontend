import './App.css';
import AppRoutes from './components/AppRoutes';

function App() {

  navigator.serviceWorker.getRegistrations().then(function (registrations) {
    // code to remove registraions after service worker change in a deployment
    for (let registration of registrations) {
      // console.log('unregitering', registration)
      // registration.unregister();
    }

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

  return (
    <div className="App">
      <AppRoutes />
    </div>
  );
}

export default App;
