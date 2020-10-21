import styled from 'styled-components';
import Button from '../../../../components/Form/Button';

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

export const Header = styled.header`
  width: 100%;
  display: flex;
  justify-content: flex-end;

  margin: 15px 0 50px;
  padding: 0 25px;
`;

export const UserContainer = styled.div``;

export const Content = styled.main`
  width: 100%;

  display: flex;
  flex-direction: column;
  justify-content: space-around;
`;

export const BackButton = styled(Button)`
  font-size: 22px;
  width: 50px;
  height: 40px;
`;

export const Form = styled.form`
  width: 100%;
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;

  margin-top: 30px;
`;

export const InputBox = styled.div`
  width: 200px;

  display: flex;
  flex-direction: column;

  margin: 10px 0;
`;

export const InputHeader = styled.header`
  background-color: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.white};
  text-align: center;

  padding: 15px;
  border-top-left-radius: 7px;
  border-top-right-radius: 7px;
`;

export const Input = styled.input`
  font-size: 44px;
  padding: 5px 5px;

  font-weight: bold;
  text-align: center;

  border-color: ${props => props.theme.colors.secondary};
  border-bottom-left-radius: 7px;
  border-bottom-right-radius: 7px;
`;

export const ButtonCalc = styled.button`
  background-color: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.white};

  margin: 10px 60px;
  padding: 15px;
  border-radius: 7px;

  font-size: 24px;
  font-weight: bold;
`;

export const Footer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;

  margin-top: 70px;
`;

export const ReferenceButton = styled.a`
  display: flex;
  align-items: center;
  font-size: 18px;
  color: ${props => props.theme.colors.black};
  text-decoration: none;

  cursor: pointer;
  transition: opacity 0.3s;

  &:hover {
    opacity: 0.8;
  }

  svg {
    font-size: 30px;
  }
`;

export const Result = styled.div`
  text-align: center;

  h2 {
    font-size: 64px;
    font-weight: bold;
  }
`;

export const ReferenceLabel = styled.span`
  color: ${props => props.theme.colors.black};
  font-weight: bold;
`;
