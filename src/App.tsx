import React from 'react';

import { ThemeProvider } from 'styled-components';
import GlobalStyles from './styles/global';

import AppProvider from './hooks';

import Routes from './routes';

import light from './styles/themes/light';

const App: React.FC = () => (
  <ThemeProvider theme={light}>
    <GlobalStyles />
    <AppProvider>
      <Routes />
    </AppProvider>
  </ThemeProvider>
);

export default App;
