import React, { useState } from 'react';

import {
  Container,
  ImagePreview,
  ThumbnailContainer,
  ThumbnailButton,
} from './styles';

interface IImageSliderPreviewProps {
  imageDefault: string;
  photos: string[];
}

const ImageSliderPreview: React.FC<IImageSliderPreviewProps> = ({
  imageDefault,
  photos,
}) => {
  const [photoSelected, setPhotoSelected] = useState(imageDefault);

  return (
    <Container>
      <ImagePreview image={photoSelected} />
      <ThumbnailContainer>
        {photos.map(photo => (
          <ThumbnailButton
            key={photo}
            image={photo}
            onClick={() => setPhotoSelected(photo)}
          />
        ))}
      </ThumbnailContainer>
    </Container>
  );
};

export default ImageSliderPreview;
