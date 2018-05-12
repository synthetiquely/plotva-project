import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import { Provider } from 'react-redux';
import { store } from './store/store';
import { setUser } from './store/actions/userActions';

import { App } from './components/App/App';

import regSw from './reg-sw';

import api from './api/chat';

import './index.css';

import { registerSocketEventListeners } from './registerSocketEventListeners';

(async () => {
  const user = await api.getCurrentUser();

  if (user) {
    store.dispatch(setUser(user));
  }

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
})();
