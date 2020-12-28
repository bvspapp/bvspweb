import React from 'react';

import {
  Container,
  Image,
  Controllers,
  RemoveImageButton,
  StepNumberContainer,
  StepNumberLabel,
  StepNumberInput,
} from './styles';

interface IImageControllerByStepsProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  containerCustomStyle?: React.CSSProperties;
  url: string;
  handleRemoveImage(): void;
  markedToRemove?: boolean;
  min: number;
  max: number;
}

const ImageControllerBySteps: React.FC<IImageControllerByStepsProps> = ({
  containerCustomStyle,
  url,
  handleRemoveImage,
  markedToRemove = false,
  ...rest
}) => (
  <Container style={containerCustomStyle}>
    <Image src={url} alt="" markedToRemove={markedToRemove} />

    <Controllers>
      <StepNumberContainer>
        <StepNumberLabel>Passo Nº:</StepNumberLabel>
        <StepNumberInput type="number" {...rest} />
      </StepNumberContainer>

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

export default ImageControllerBySteps;
