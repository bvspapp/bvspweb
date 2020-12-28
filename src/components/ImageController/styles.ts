import styled from 'styled-components';

interface IImageControllerProps {
  markedToRemove: boolean;
}

interface ISetAsCoverButtonProps {
  isImageCover: boolean;
}

export const Container = styled.div`
  height: 110px;
  width: 130px;

  background-color: ${props => props.theme.colors.white};
`;

export const Image = styled.img<IImageControllerProps>`
  width: 100%;
  height: 70px;

  opacity: ${props => (props.markedToRemove ? '0.5' : '1')};
`;

export const Controllers = styled.div`
  width: 100%;
  height: 40px;

  display: flex;
  align-items: center;
  justify-content: space-around;
`;

export const SetAsCoverButton = styled.button<ISetAsCoverButtonProps>`
  background: none;
  color: ${props =>
    props.isImageCover
      ? props.theme.colors.success
      : props.theme.colors.tertiary};

  transition: opacity 0.3s;

  &:hover {
    opacity: 0.7;
  }
`;

export const RemoveImageButton = styled.button<IImageControllerProps>`
  background: none;
  color: ${props =>
    props.markedToRemove
      ? props.theme.colors.success
      : props.theme.colors.warning};

  font-size: 13px;

  transition: opacity 0.3s;

  &:hover {
    opacity: 0.7;
  }
`;
