import React from 'react';

import { Container, Text } from './styles';

interface ISubTitleDividerProps {
  title: string;
}

const SubTitleDivider: React.FC<ISubTitleDividerProps> = ({ title }) => (
  <Container>
    <Text>{title}</Text>
  </Container>
);

export default SubTitleDivider;
