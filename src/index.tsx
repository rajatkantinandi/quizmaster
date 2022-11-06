import React from 'react';
import ReactDOM from 'react-dom';
import 'semantic-ui-css/semantic.min.css';
import './styles/variables.css';
import './styles/index.css';
import './styles/spacing.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { get } from './helpers';
import { useStore } from './useStore';
import Cookies from 'js-cookie';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import { MantineProvider } from '@mantine/core';

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
  function getButtonCss(params) {
    if (params.color) {
      return {};
    } else {
      switch (params.variant) {
        case 'filled':
          return {
            backgroundColor: '#014751',

            '&:hover': {
              backgroundColor: '#016c7b',
            },
          };
        case 'default':
          return {
            backgroundColor: '#F1D600',
            border: 'none',

            '&:hover': {
              backgroundColor: '#ffe30c',
            },
          };
        case 'outline':
          return {
            color: '#014751',
            borderColor: '#014751',
            fontSize: 'bold',
          };
        case 'light':
          return {
            color: '#014751',
            fontSize: 'bold',
          };
        case 'subtle':
          return {
            padding: '3px',

            '&:hover': {
              backgroundColor: 'transparent',
            },
          };
        default:
          return {};
      }
    }
  }

  function getTabStyle(theme, params) {
    switch (params.variant) {
      case 'pills':
        return {
          ...theme.fn.focusStyles(),
          fontWeight: 'bold',
          color: theme.colors['qm-primary'][0],
          border: `1px solid ${theme.colors['qm-primary'][0]}`,

          '&:hover': {
            backgroundColor: 'transparent',
          },

          '&[data-active]': {
            backgroundColor: theme.colors['qm-primary'][0],
            color: theme.white,

            '&:hover': {
              backgroundColor: theme.colors['qm-primary'][0],
            },
          },
        };
      case 'default':
        return {
          ...theme.fn.focusStyles(),
          fontWeight: 500,
          fontSize: '16px',

          '&[data-active]': {
            backgroundColor: theme.white,
            color: theme.colors['qm-primary'][0],
            borderColor: theme.colors['qm-primary'][0],

            '&:hover': {
              backgroundColor: theme.colors['qm-primary'][0],
              color: theme.white,
              borderColor: theme.white,
            },
          },
        };
      default:
        return {};
    }
  }

  return ReactDOM.render(
    <React.StrictMode>
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          colors: {
            background: ['#F5F6E6', '#AFD0D4', '#E4FAFC', '#F1D600', '#85BB65'],
            border: ['#adc3c7'],
            textColor: ['#ffeeb4'],
            'qm-primary': ['#014751'],
          },
          shadows: {
            xs: '0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12)',
            sm: '0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12)',
          },
          defaultRadius: 0,
          radius: {
            xs: 4,
          },
          components: {
            TextInput: {
              styles: (theme, params) => ({
                input:
                  params.variant === 'filled'
                    ? {
                        backgroundColor: '#E4FAFC',
                        boxShadow: theme.shadows.sm,
                        '::placeholder': {
                          color: '#014751',
                        },
                      }
                    : {},
              }),
            },
            Textarea: {
              styles: (theme, params) => ({
                input:
                  params.variant === 'filled'
                    ? {
                        backgroundColor: '#E4FAFC',
                        boxShadow: theme.shadows.sm,
                        '::placeholder': {
                          color: '#014751',
                        },
                      }
                    : {},
              }),
            },
            Button: {
              styles: (theme, params) => ({
                root: getButtonCss(params),
              }),
            },
            Tabs: {
              styles: (theme, params) => ({
                tab: getTabStyle(theme, params),
                tabsList: params.variant === 'pills' ? { gap: 0 } : {},
              }),
            },
            Checkbox: {
              styles: (theme, params) => ({
                input: {
                  backgroundColor: '#C4FCEB',
                  borderColor: '#014751',

                  '&:checked': {
                    backgroundColor: '#C4FCEB',
                    borderColor: '#014751',
                  },
                },
                icon: {
                  color: '#014751',
                },
              }),
            },
            Radio: {
              styles: (theme, params) => ({
                radio: {
                  backgroundColor: 'white',
                  borderColor: '#014751',

                  '&:checked': {
                    backgroundColor: 'white',
                    borderColor: '#014751',
                  },
                },
                icon: {
                  color: '#014751',
                },
              }),
            },
          },
        }}>
        <App />
      </MantineProvider>
    </React.StrictMode>,
    document.getElementById('root'),
  );
}
