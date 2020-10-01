import React from 'react';
import { Switch, Route } from 'react-router-dom';

import SignInAdmin from '../pages/SignInAdmin';
import SignInUser from '../pages/SignInUser';
import SignUpUser from '../pages/SignUpUser';
import ForgotPassword from '../pages/ForgotPassword';
import ResetPassword from '../pages/ResetPassword';

const AuthRoutes: React.FC = () => (
  <Switch>
    <Route exact path="/" component={SignInUser} />
    <Route exact path="/signup" component={SignUpUser} />
    <Route exact path="/forgot-password" component={ForgotPassword} />
    <Route exact path="/reset-password" component={ResetPassword} />

    <Route exact path="/admin" component={SignInAdmin} />
  </Switch>
);

export default AuthRoutes;
