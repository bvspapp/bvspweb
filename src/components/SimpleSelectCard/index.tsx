import React from 'react';
import { MdKeyboardArrowRight } from 'react-icons/md';

import { Container, Title, Icon } from './styles';

interface ISimpleSelectCardProps {
  title: string;
  link: string;
}

const SimpleSelectCard: React.FC<ISimpleSelectCardProps> = ({title, link}) => {
  return (
    <Container to={link}>
      <Title>{title}</Title>
      <Icon>
        <MdKeyboardArrowRight />
      </Icon>
    </Container>
  )
}

export default SimpleSelectCard;
