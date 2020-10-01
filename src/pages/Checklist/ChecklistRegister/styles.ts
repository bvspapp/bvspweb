import styled from 'styled-components';
import { Form as Unform } from '@unform/web';
import TextInput from '../../../components/Form/TextInput';

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

export const MachinesHeader = styled.div`
  width: 100%;

  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const MachineLabel = styled.span`
  text-transform: uppercase;

  font-size: 13px;
  color: ${props => props.theme.colors.tertiary};
`;

export const MachinesContainer = styled.div`
  width: 100%;

  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
`;

export const MachinesContent = styled.div`
  width: 100%;
  background-color: ${props => props.theme.colors.white};

  border-radius: 5px;

  margin: 10px 0;
`;

export const ChecklistContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  margin: 15px 0;
`;

export const ChecklistHeader = styled.header`
  margin: 20px 0;
`;

export const ChecklistListTitle = styled.h1`
  font-size: 22px;
  text-align: center;
`;

export const ChecklistListSubTitle = styled.p`
  text-align: center;
`;

export const ChecklistInputGroup = styled.div`
  width: 100%;

  display: flex;
  align-items: flex-end;
`;

export const ButtonAddNewStep = styled.button`
  font-size: 22px;
  background-color: ${props => props.theme.colors.success};
  color: #fff;

  display: flex;
  align-items: center;
  margin-left: 10px;

  border: none;

  padding: 10px;
  margin-bottom: 8px;

  border-radius: 5px;

  cursor: pointer;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.7;
  }
`;

export const ButtonEditStep = styled.button`
  font-size: 22px;
  background-color: ${props => props.theme.colors.success};
  color: #fff;

  display: flex;
  align-items: center;
  margin-left: 10px;

  border: none;

  padding: 10px;
  margin-bottom: 8px;

  border-radius: 5px;

  cursor: pointer;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.7;
  }
`;

export const TextInputStep = styled(TextInput).attrs({
  containerCustomStyle: {
    flex: 1,
  },
})``;

export const StepsContent = styled.div``;

export const StepWrapper = styled.div``;
