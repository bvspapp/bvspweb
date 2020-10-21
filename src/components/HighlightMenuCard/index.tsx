import React from 'react';

import { FaArrowRight } from 'react-icons/fa';

import {
  Container,
  Image,
  Title,
  SubTitle,
  Button,
  TextContainer,
} from './styles';

interface IProps {
  link: string;
  image: string;
  title: string;
  subtitle?: string;
  inative?: boolean;
}

const HighlightMenuCard: React.FC<IProps> = ({
  link,
  image,
  title,
  subtitle,
}) => {
  return (
    <Container to={link}>
      <Image imageURL={image} />

      <TextContainer>
        <Title>{title}</Title>
        <SubTitle>{subtitle}</SubTitle>
      </TextContainer>

      <Button>
        <FaArrowRight />
      </Button>
    </Container>
  );
};

export default HighlightMenuCard;
