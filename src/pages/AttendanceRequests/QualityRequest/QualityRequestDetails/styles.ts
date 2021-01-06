import styled from 'styled-components';
import { Form as Unform } from '@unform/web';
import Button from '../../../../components/Form/Button';

export const Container = styled.div``;

export const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;

  margin-bottom: 30px;
`;

export const Content = styled.div``;

export const Title = styled.h2``;

export const ButtonsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;

  > button {
    margin-left: 7px;
  }
`;

export const Form = styled(Unform)``;

export const FormRow = styled.div`
  width: 100%;

  display: flex;
  justify-content: space-between;
  align-items: center;

  margin: 10px 0;
`;

export const FormContent = styled.fieldset`
  padding: 17px 10px;

  border: none;
  border-radius: 7px;
`;

export const AttendanceInfo = styled.div`
  display: flex;
  align-items: center;

  > strong {
    margin-right: 5px;
  }

  > svg {
    font-size: 22px;
  }

  .isopen {
    color: #2dd802;
    font-weight: bold;
  }
`;

export const RememberContainer = styled.div`
  display: flex;
`;

export const HistoryButton = styled(Button)`
  height: 30px;
  font-size: 14px;
`;

export const AlertSaveButton = styled(Button)`
  height: 30px;
  font-size: 14px;
  margin-top: 34px;
  margin-left: 10px;
`;

export const ClientDescription = styled.div`
  margin-top: 20px;
  margin-left: 5px;
`;

export const HistoryHeader = styled.header`
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 0 10px;
`;

export const HistoryTitle = styled.h3``;

export const HistoryModalClose = styled.button`
  background: none;
  border: none;
  font-size: 20px;

  transition: opacity 0.3s;

  &:hover {
    opacity: 0.7;
  }
`;

export const StatusRequestLabel = styled.h3`
  text-align: center;
  margin-bottom: 5px;
`;

export const StatusRequest = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;

export const FilesContainer = styled.div``;

export const FileLink = styled.a`
  font-weight: bold;
  font-size: 12px;
  text-transform: uppercase;
  cursor: pointer;
  transform: opacity 0.3s;

  margin-right: 15px;

  text-decoration: none;
  cursor: pointer;

  background-color: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.white};
  padding: 7px 10px;
  border-radius: 5px;


  &:hover {
    opacity: 0.8;
  }
`;

export const FilesTitle = styled.p`
  margin-bottom: 10px;
  font-weight: bold;
`;
