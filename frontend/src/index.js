import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.jsx';


// Always open app at Home on first load in this setup.
if (window.location.pathname === '/') {
  window.history.replaceState({}, '', '/homepage');
}


const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

