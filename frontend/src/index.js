import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.jsx';

<<<<<<< HEAD
// "/" now shows LoaderPage which auto-redirects to /homepage after 3 seconds.
// The old window.history.replaceState hack has been removed — no longer needed.
=======
// Always open app at Home on first load in this setup.
if (window.location.pathname === '/') {
  window.history.replaceState({}, '', '/homepage');
}
>>>>>>> origin/CV-Builder

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
<<<<<<< HEAD
);
=======
);
>>>>>>> origin/CV-Builder
