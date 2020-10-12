import React from 'react';

import { AuthProvider } from './auth';
import { TranslateProvider } from './translation';

const AppProvider: React.FC = ({ children }) => (
  <TranslateProvider>
    <AuthProvider>{children}</AuthProvider>
  </TranslateProvider>
);

export default AppProvider;
