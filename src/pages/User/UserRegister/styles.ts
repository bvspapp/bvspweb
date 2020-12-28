import styled from 'styled-components';
import { Form as Unform } from '@unform/web';
import SelectInput from '../../../components/Form/SelectInput';

export const Container = styled.div``;

export const Form = styled(Unform)``;

export const FormHeader = styled.header`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;

  margin-bottom: 15px;
`;

export const Title = styled.h2``;

export const ButtonsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;

  > button {
    margin-left: 7px;
  }
`;

export const FormContent = styled.fieldset`
  background-color: ${props => props.theme.colors.secondary};

  padding: 17px 10px;

  border: none;
  border-radius: 7px;
`;

export const Select = styled(SelectInput)``;
