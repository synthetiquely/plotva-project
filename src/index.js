import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import { Provider } from 'react-redux';
import { store } from './store/store';

import { App } from './components/App/App';

import { registerSocketEventListeners } from './registerSocketEventListeners';
import regSw from './reg-sw';

import './index.css';

registerSocketEventListeners(store);

ReactDOM.render(
  <BrowserRouter>
    <Provider store={store}>
      <App />
    </Provider>
  </BrowserRouter>,
  document.getElementById('root'),
);
regSw();
