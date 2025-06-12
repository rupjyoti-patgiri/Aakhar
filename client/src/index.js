import React from 'react';
import ReactDOM from 'react-dom/client';
import './assets/styles/index.css'; // Your global styles
import App from './App.jsx'; // Corrected import
import { PostProvider } from './context/PostContext.jsx'; // Corrected import
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <PostProvider> {/* Wrap App with PostProvider */}
      <App />
    </PostProvider>
  </React.StrictMode>
);

reportWebVitals();