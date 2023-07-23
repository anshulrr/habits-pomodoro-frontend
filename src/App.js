import './App.css';
import AppRoutes from './components/AppRoutes';

function App() {

  if ("serviceWorker" in navigator) {
    // Register a service worker hosted at the root of the
    // site using the default scope.
    console.log("available")
    navigator.serviceWorker.register("service_worker.js").then(
      (registration) => {
        console.log("Service worker registration succeeded:", registration);
      },
      (error) => {
        console.error(`Service worker registration failed: ${error}`);
      },
    );
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
