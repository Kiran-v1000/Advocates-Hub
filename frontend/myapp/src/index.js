import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { loadAdvocates } from './data/Advocatesstore';

const root = ReactDOM.createRoot(document.getElementById('root'));
// Warm the advocate cache from the API before first paint (falls back to
// the last cached copy if the backend is down).
loadAdvocates().catch(() => {}).finally(() => root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
));

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
