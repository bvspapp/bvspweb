import React from 'react';

import MainHeader from '../MainHeaderAdmin';

import { Grid, Content } from './styles';

const AppLayoutAdmin: React.FC = ({ children }) => (
  <Grid>
    <MainHeader />
    <Content>{children}</Content>
  </Grid>
);

export default AppLayoutAdmin;
