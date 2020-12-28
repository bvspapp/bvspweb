import styled from 'styled-components';
import { Form as Unform } from '@unform/web';

import Department from '../../../../components/DepartmentCard';

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

export const DepartmentsContainer = styled.div`
  margin-top: 15px;
  padding: 17px 10px;

  background-color: ${props => props.theme.colors.secondary};

  border: none;
  border-radius: 7px;
`;

export const DepartmentsHeader = styled.div`
  width: 100%;

  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const DepartmentLabel = styled.span`
  text-transform: uppercase;

  font-size: 14px;
  color: ${props => props.theme.colors.tertiary};
`;

export const DepartmentCard = styled(Department).attrs({
  containerCustomStyle: {
    marginTop: '10px',
  },
})``;
