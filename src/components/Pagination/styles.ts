import styled from 'styled-components';
import Button from '../Form/Button';

export const Container = styled.div`
  width: 100%;

  margin-top: 10px;
  padding-right: 20px;

  display: flex;
  justify-content: flex-end;

  position: absolute;
  bottom: 40px;
  right: 40px;

  button + button {
    margin-left: 10px;
  }
`;

export const ButtonPaginate = styled(Button)``;
