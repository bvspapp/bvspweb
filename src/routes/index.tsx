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

    switch (user.profile.name) {
      case 'gestão':
        return <Admin />;
      case 'atendimento':
        return <Admin />;
      case 'engenharia':
        return <Admin />;
      case 'orçamento':
        return <Admin />;
      case 'venda':
        return <Admin />;
      case 'cliente':
        return <User />;
      default:
        return <Auth />;
    }
  };

  return (
    <BrowserRouter>
      <Route />
    </BrowserRouter>
  );
};

export default Routes;
