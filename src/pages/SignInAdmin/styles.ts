import styled from 'styled-components';
import { Form as Unform } from '@unform/web';
import Button from '../../components/Form/Button';

import TextInput from '../../components/Form/TextInput';

export const Container = styled.div`
  height: 100vh;

  display: flex;
  flex-direction: column;
  flex: 1;

  justify-content: center;
  align-items: center;
`;

export const Logo = styled.img`
  height: 45px;

  margin-bottom: 50px;
`;

export const Form = styled(Unform)`
  min-width: 330px;

  display: flex;
  flex-direction: column;

  background-color: ${props => props.theme.colors.secondary};
  padding: 20px;

  border-radius: 10px;
`;

export const Title = styled.h2`
  margin-bottom: 20px;

  &:after {
    content: '';
    display: block;
    width: 55px;
    border-bottom: 7px solid ${props => props.theme.colors.primary};
  }
`;

export const SignInButton = styled(Button)`
  margin-top: 30px;
  padding: 10px;
`;

export const Input = styled(TextInput).attrs({
  containerCustomStyle: {
    margin: '3px 0',
  },
})``;
