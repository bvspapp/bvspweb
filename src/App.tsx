import React from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

import { ThemeProvider } from 'styled-components';
import GlobalStyles from './styles/global';

import AppProvider from './hooks';

import Routes from './routes';

import light from './styles/themes/light';

const App: React.FC = () => (
  <ThemeProvider theme={light}>
    <GlobalStyles />
    <ToastContainer />
    <AppProvider>
      <Routes />
    </AppProvider>
  </ThemeProvider>
);

export default App;
