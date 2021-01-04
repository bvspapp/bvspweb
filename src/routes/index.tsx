import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import { useAuth } from '../hooks/auth';

import Admin from './admin.routes';
import User from './user.routes';
import Auth from './auth.routes';

const Routes: React.FC = () => {
  const { user } = useAuth();

  const Route = () => {
    if (!user) return <Auth />;

    if(user.profile.name === 'cliente')
      return <User />;
    else
      return <Admin />;
  };

  return (
    <BrowserRouter>
      <Route />
    </BrowserRouter>
  );
};

export default Routes;
