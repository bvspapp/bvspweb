import React from 'react';

import { Container, Title, SubTitle } from './styles';

interface IProps {
  title: string;
  subtitle?: string;
  lineAlign?: 'center' | 'left';
}

const HighlightTitle: React.FC<IProps> = ({
  title,
  subtitle,
  lineAlign = 'center',
}) => {
  return (
    <Container lineAlign={lineAlign}>
      <Title>{title}</Title>
      <SubTitle>{subtitle}</SubTitle>
    </Container>
  );
};

export default HighlightTitle;
