import React, { useCallback } from 'react';
import Dropzone, { DropEvent } from 'react-dropzone';

import { Container, DropContainer, UploadMessage } from './styles';

interface IUploadImagesProps {
  onUpload(files: File[], event: DropEvent): void;
}

const UploadImages: React.FC<IUploadImagesProps> = ({ onUpload }) => {
  const renderDragMessage = useCallback((isDragActive, isDragReject) => {
    if (!isDragActive) {
      return (
        <UploadMessage type="default">Arraste as imagens aqui...</UploadMessage>
      );
    }

    if (isDragReject) {
      return <UploadMessage type="error">Arraste não suportado</UploadMessage>;
    }

    return <UploadMessage type="success">Solte as imagens aqui</UploadMessage>;
  }, []);

  return (
    <Container>
      <Dropzone accept="image/*" onDropAccepted={onUpload}>
        {({ getRootProps, getInputProps, isDragActive, isDragReject }) => (
          <DropContainer
            {...getRootProps()}
            isDragActive={isDragActive}
            isDragReject={isDragReject}
          >
            <input {...getInputProps()} />

            {renderDragMessage(isDragActive, isDragReject)}
          </DropContainer>
        )}
      </Dropzone>
    </Container>
  );
};

export default UploadImages;
