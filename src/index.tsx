import React from 'react';
import ReactDOM from 'react-dom';
import './styles/variables.css';
import './styles/index.css';
import './styles/spacing.css';
import './styles/markdown.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { get } from './helpers';
import { useStore } from './useStore';
import Cookies from 'js-cookie';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import { MantineProvider } from '@mantine/core';
import theme from './styles/theme';

if (Cookies.get('userToken')) {
  get('user/data').then((resp) => {
    useStore.setState({ userData: resp });

    renderDom();
  });
} else {
  renderDom();
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

serviceWorkerRegistration.register({
  onUpdate: (registration) => {
    const waitingServiceWorker = registration.waiting;

    if (waitingServiceWorker) {
      waitingServiceWorker.addEventListener('statechange', (event: any) => {
        if (event.target.state === 'activated') {
          alert('The app has been updated 🎉! It will reload now!');
          window.location.reload();
        }
      });
      waitingServiceWorker.postMessage({ type: 'SKIP_WAITING' });
    }
  },
});

function renderDom() {
  return ReactDOM.render(
    <React.StrictMode>
      <MantineProvider withGlobalStyles withNormalizeCSS theme={theme}>
        <App />
      </MantineProvider>
    </React.StrictMode>,
    document.getElementById('root'),
  );
}
