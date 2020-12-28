import styled from 'styled-components';
import { Form as Unform } from '@unform/web';
import Button from '../../../components/Form/Button';

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

export const LabelFlowTypes = styled.h4`
  text-align: center;
`;

export const AttendanceContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-around;

  margin-top: 15px;
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
