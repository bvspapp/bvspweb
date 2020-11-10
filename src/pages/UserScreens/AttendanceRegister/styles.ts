import styled from 'styled-components';
import { Form as Unform } from '@unform/web';
import Button from '../../../components/Form/Button';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;

  flex-wrap: wrap;
  flex: 1;
`;

export const Content = styled.main`
  flex: 1;
  margin-top: 70px;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const Form = styled(Unform)`
  margin-top: 40px;
`;

export const ButtonRegister = styled(Button)`
  font-size: 14px;
  align-self: flex-end;

  margin: 10px;
`;

export const FormContent = styled.fieldset`
  padding: 17px 10px;

  border: none;
  border-radius: 7px;
`;

export const InputsColumnContainer = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;

  margin-bottom: 30px;
`;

export const LabelText = styled.div``;

export const ContactIllustration = styled.img`
  position: absolute;
  bottom: -50px;

  height: 500px;
  width: 450px;

  align-self: flex-end;
`;
