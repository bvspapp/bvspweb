import styled, { keyframes } from 'styled-components';
import { Form as Unform } from '@unform/web';
import { Link } from 'react-router-dom';

import Button from '../../components/Form/Button';
import TextInput from '../../components/Form/TextInput';

import bgImage from '../../assets/bgsignin.png';

interface ITranslateProps {
  actived: boolean;
}

const animate = keyframes`
    0% {
        transform: translateX(-100px);
        opacity: 0;
    }
    50%{
        opacity: .3;
    }
    100%{
        transform: translateX(0px);
        opacity: 1;
    }
`;

export const Container = styled.div`
  height: 100vh;

  display: flex;
  flex-direction: column;
  flex: 1;

  justify-content: center;
  align-items: flex-start;

  background-image: url(${bgImage});
  background-repeat: none;
  background-size: cover;

  overflow-y: scroll;

  @media (max-width: 700px) {
    align-items: center;
  }
`;

export const Content = styled.div`
  margin-left: 100px;

  @media (max-width: 700px) {
    margin: 0;
  }
`;

export const Form = styled(Unform)`
  min-width: 370px;

  display: flex;
  flex-direction: column;
  align-items: flex-start;

  background-color: ${props => props.theme.colors.white};
  padding: 20px;

  border-radius: 5px;
  animation: ${animate} 0.5s;
`;

export const Title = styled.h1`
  color: ${props => props.theme.colors.primary};
  margin-bottom: 20px;

  &:after {
    content: '';
    display: block;
    width: 30px;
    border-bottom: 7px solid ${props => props.theme.colors.primary};
  }
`;

export const SignInButton = styled(Button)`
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

export const Logo = styled.img`
  margin-top: 15px;
  margin-bottom: 40px;

  height: 35px;
  align-self: center;
`;

export const CreateAccountContainer = styled.div`
  margin-top: 15px;
  min-width: 370px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  background-color: ${props => props.theme.colors.white};
  padding: 20px;

  border-radius: 5px;

  animation: ${animate} 0.5s;
`;

export const CreateAccountLink = styled(Link)`
  display: flex;
  align-items: center;

  text-decoration: none;
  color: ${props => props.theme.colors.primary};
  font-weight: bold;

  transition: opacity 0.3s;

  &:hover {
    opacity: 0.7;
  }

  > svg {
    margin-right: 7px;
  }
`;

export const LoadContainer = styled.div`
  width: 370px;
  height: 300px;
  border-radius: 5px;

  display: flex;
  align-items: center;
  justify-content: center;

  background-color: ${props => props.theme.colors.white};
`;

export const ForgotPassword = styled(Link)`
  text-decoration: none;
  font-size: 13px;
  font-weight: bold;

  margin: 20px auto 10px;

  color: ${props => props.theme.colors.black};

  transition: opacity 0.3s;

  &:hover {
    opacity: 0.8;
  }
`;

export const TranslateContainer = styled.div`
  width: 100%;
  margin-top: 10px;
  display: flex;
  justify-content: center;
`;

export const TranslateButton = styled.button<ITranslateProps>`
  margin: 0 10px;
  transition: opacity 0.3s;

  background: none;
  border: none;

  opacity: ${props => (props.actived ? 1 : 0.4)};

  &:hover {
    opacity: 0.7;
  }
`;

export const TranslateImage = styled.img`
  width: 30px;
`;
