import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import Case_details from './Component/Case_details';
import Dashboard from './Main/Dashboard';
import store from './REDUX/store';
import { Provider } from 'react-redux';
import LawyerProfile from './Main/Pages/LawyerProfile';
import SignIn from './Main/Pages/SignIn';
import SignUp_Screen from './Main/Pages/SignUp_Screen';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { loadStripe } from '@stripe/stripe-js';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);

reportWebVitals();
