import React from 'react';

import loadSvg from '../../assets/load.svg';

import { Container, Image } from './styles';

const Load: React.FC = () => (
  <Container>
    <Image src={loadSvg} alt="Loading" />
  </Container>
);

export default Load;
