import React from 'react';

import { MdWallpaper } from 'react-icons/md';
import {
  Container,
  Image,
  Controllers,
  SetAsCoverButton,
  RemoveImageButton,
} from './styles';

interface IImageControllerProps {
  containerCustomStyle?: React.CSSProperties;
  url: string;
  handleRemoveImage(): void;
  markedToRemove?: boolean;
  handleSetImageCover(): void;
  isImageCover?: boolean;
}

const ImageController: React.FC<IImageControllerProps> = ({
  containerCustomStyle,
  url,
  handleRemoveImage,
  markedToRemove = false,
  handleSetImageCover,
  isImageCover,
}) => (
  <Container style={containerCustomStyle}>
    <Image src={url} alt="" markedToRemove={markedToRemove} />
    <Controllers>
      {isImageCover && (
        <SetAsCoverButton
          type="button"
          onClick={handleSetImageCover}
          isImageCover={isImageCover}
        >
          <MdWallpaper />
        </SetAsCoverButton>
      )}
      <RemoveImageButton
        type="button"
        onClick={handleRemoveImage}
        markedToRemove={markedToRemove}
      >
        {markedToRemove ? 'Desfazer' : 'Excluír'}
      </RemoveImageButton>
    </Controllers>
  </Container>
);

export default ImageController;
