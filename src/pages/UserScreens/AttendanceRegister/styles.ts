import styled from 'styled-components';
import { Form as Unform } from '@unform/web';
import ReactFlagsSelect from 'react-flags-select';
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

  z-index: 1;
`;

export const ButtonRegister = styled(Button)`
  width: 100%;
  height: 40px;

  font-size: 18px;
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

export const TextWait = styled.p`
  font-weight: bold;
  text-align: center;

  margin-top: 70px;
`;

export const LabelText = styled.div``;

export const ContactIllustration = styled.img`
  position: absolute;
  bottom: -50px;

  height: 500px;
  width: 450px;

  align-self: flex-end;

  opacity: 0.9;
`;

export const CountrySelect = styled(ReactFlagsSelect).attrs({
  showSelectedLabel: false,
  showOptionLabel: false,
  selectedSize: 32,
  optionsSize: 24,
})`
  margin-right: 10px;
  margin-top: 18px;
`;
