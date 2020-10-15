import React from 'react';
import { FaChevronRight } from 'react-icons/fa';

import { Container, Icon, Title } from './styles';

interface IProps {
  title: string;
  to: string;
}
const ArrowMenu: React.FC<IProps> = ({ title, to }) => (
  <Container to={to}>
    <Icon>
      <FaChevronRight />
    </Icon>
    <Title>{title}</Title>
  </Container>
);
export default ArrowMenu;
