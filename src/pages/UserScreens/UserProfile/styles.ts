import styled from 'styled-components';
import { Form as Unform } from '@unform/web';

import Button from '../../../components/Form/Button';
import TextInput from '../../../components/Form/TextInput';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;

  flex-wrap: wrap;
  flex: 1;
`;

export const SaveButton = styled(Button)`
  width: 100%;

  margin-top: 30px;
  padding: 13px 10px;
`;

export const Input = styled(TextInput).attrs({
  containerCustomStyle: {
    margin: '3px 0',
    width: '100%',
  },
})``;

export const Header = styled.header`
  width: 100%;
  display: flex;
  justify-content: space-between;

  margin-top: 15px;
  padding: 0 25px;
`;

export const UserContainer = styled.div``;

export const Content = styled.main`
  flex: 1;
  margin-top: 65px;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const BackButton = styled(Button)`
  font-size: 22px;
  width: 50px;
  height: 40px;
`;

export const Form = styled(Unform)`
  min-width: 370px;

  display: flex;
  flex-direction: column;
  align-items: flex-start;

  padding: 20px;
  margin-top: 20px;

  border-radius: 5px;
`;

export const InputRows = styled.div`
  width: 100%;

  display: flex;
`;

export const PasswordInfo = styled.p`
  margin-top: 40px;
  margin-bottom: 5px;
  font-size: 14px;
  color: ${props => props.theme.colors.tertiary};
`;
