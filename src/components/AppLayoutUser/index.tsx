import React from 'react';

import FloatMenuUser from '../FloatMenuUser';

import { Grid, Content } from './styles';

const AppLayoutUser: React.FC = ({ children }) => (
  <Grid>
    <FloatMenuUser />
    <Content>{children}</Content>
  </Grid>
);

export default AppLayoutUser;
