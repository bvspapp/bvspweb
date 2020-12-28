import React from 'react';

import { Container, ImagePreview, TitleContainer, TitleText } from './styles';

interface IProductCardProps {
  link: string;
  image: string;
  title: string;
}

const ProductCard: React.FC<IProductCardProps> = ({ link, title, image }) => {
  return (
    <Container to={link}>
      <ImagePreview imageURL={image} />
      <TitleContainer>
        <TitleText>{title}</TitleText>
      </TitleContainer>
    </Container>
  );
};

export default ProductCard;
