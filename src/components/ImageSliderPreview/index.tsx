import React from 'react';
import ImageGallery from 'react-image-gallery';

import { Container } from './styles';

interface IImageSliderPreviewProps {
  photos: {
    original: string;
    thumbnail: string;
  }[];
}

const ImageSliderPreview: React.FC<IImageSliderPreviewProps> = ({ photos }) => {
  return (
    <Container>
      <ImageGallery items={photos} showPlayButton={false} />
    </Container>
  );
};

export default ImageSliderPreview;
