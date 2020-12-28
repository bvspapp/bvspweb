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

export const FormContent = styled.fieldset`
  padding: 17px 10px;

  border: none;
  border-radius: 7px;
`;

export const FormRow = styled.div`
  width: 100%;

  display: flex;
  align-items: center;
`;

export const UserSelectButton = styled(Button)`
  width: 42px;
  height: 42px;

  margin-top: 18px;
  margin-right: 20px;
`;

export const LabelFlowTypes = styled.h4`
  text-align: center;
  margin-top: 50px;
`;

export const AttendanceContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-around;

  margin-top: 15px;
`;

export const RememberContainer = styled.div`
  width: 100%;

  display: flex;
  justify-content: flex-end;
`;
