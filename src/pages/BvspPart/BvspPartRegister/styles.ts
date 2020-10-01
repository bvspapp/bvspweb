import styled from 'styled-components';
import { Form as Unform } from '@unform/web';
import Button from '../../../components/Form/Button';

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

export const UploadImagesLabel = styled.span`
  font-size: 12px;
  text-transform: uppercase;

  color: ${props => props.theme.colors.tertiary};
`;

export const ImagesContainer = styled.div`
  margin-top: 10px;

  display: flex;
`;

export const InputsColumnContainer = styled.div`
  width: 100%;

  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const DepartmentsContainer = styled.div`
  margin-top: 15px;

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

  font-size: 13px;
  color: ${props => props.theme.colors.tertiary};
`;

export const DepartmentContainer = styled.div`
  display: flex;
  flex-direction: column;

  width: 100%;
  background-color: #fff;

  border-radius: 7px;

  margin-top: 10px;
`;

export const MachinesContainer = styled.div`
  width: 100%;

  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
`;

export const AddMachineButton = styled(Button)`
  font-size: 14px;
  align-self: flex-end;

  margin: 10px;
`;
