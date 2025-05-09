import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './lib/theme.css'; // เพิ่มการนำเข้า theme.css
import App from './App';
import './utils/i18n'; // Import i18n configuration

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
