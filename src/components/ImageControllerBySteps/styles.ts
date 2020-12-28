import styled from 'styled-components';

interface IImageControllerProps {
  markedToRemove: boolean;
}

export const Container = styled.div`
  height: 130px;
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
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
`;

export const RemoveImageButton = styled.button<IImageControllerProps>`
  background: none;
  color: ${props =>
    props.markedToRemove
      ? props.theme.colors.success
      : props.theme.colors.warning};

  font-size: 13px;

  transition: opacity 0.3s;

  margin-top: 10px;

  &:hover {
    opacity: 0.7;
  }
`;

export const StepNumberContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;

  padding: 0 5px;
  margin-top: 7px;
`;

export const StepNumberLabel = styled.span`
  font-size: 12px;
  font-weight: bold;
  margin-right: 5px;
`;

export const StepNumberInput = styled.input`
  flex: 1;
  text-align: center;
`;
