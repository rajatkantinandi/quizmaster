import React from 'react';
import ReactDOM from 'react-dom';
import './styles/variables.css';
import './styles/index.css';
import './styles/spacing.css';
import './styles/editor.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { useStore } from './useStore';
import Cookies from 'js-cookie';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import { MantineProvider } from '@mantine/core';
import theme from './styles/theme';
import mixpanel from 'mixpanel-browser';
import { getDeviceId } from './helpers/device';
import config from './config';

try {
  if (config.env !== 'local') {
    mixpanel.init(process.env.REACT_APP_MIXPANEL_API_KEY, {
      debug: false,
      track_pageview: false,
      persistence: 'localStorage',
      ignore_dnt: true,
    });
    mixpanel.identify(getDeviceId());
  }
} catch (e: any) {
  console.log(e.message);
}

if (Cookies.get('userToken')) {
  /**
   * Original code
  ```js
    get('user/data').then((resp) => {
      useStore.setState({ userData: resp });

      renderDom();
    });
  ```
   */
  // Temporarily set user as guest
  // TODO: revert this when we have a backend & login functionality
  useStore.setState({
    userData: {
      userId: 1,
      userName: Cookies.get('userName') || 'guest',
      name: 'guest',
      emailId: 'guest@quizmasterapp.in',
      token: Cookies.get('userToken') || 'guestToken',
    },
  });

  renderDom();
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

// Prevent scroll wheel changing value for input type number
document.addEventListener('wheel', function () {
  if (document.activeElement && document.activeElement['type'] === 'number' && document.activeElement['blur']) {
    document.activeElement['blur']();
  }
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
