import styled from 'styled-components';

interface IImagePreviewProps {
  image: string;
}

export const Container = styled.div`
  border: 3px solid ${props => props.theme.colors.secondary};
  border-radius: 5px;

  padding: 20px;

  width: 100%;
`;

export const ImagePreview = styled.div<IImagePreviewProps>`
  height: 250px;

  background: url(${props => props.image});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
`;

export const ThumbnailContainer = styled.div`
  display: flex;
  justify-content: center;
`;

export const ThumbnailButton = styled.button<IImagePreviewProps>`
  background: url(${props => props.image});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;

  width: 100px;
  height: 80px;
  margin: 13px;

  border: 1px solid ${props => props.theme.colors.secondary};
  border-radius: 5px;

  transition: transform 0.3s;

  &:hover {
    transform: scale(1.07);
  }
`;
