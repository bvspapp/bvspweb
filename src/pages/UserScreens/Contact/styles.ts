import styled from 'styled-components';
import Button from '../../../components/Form/Button';

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

export const ContactContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 30px;

  z-index: 1;
`;

export const ContactBox = styled.div`
  width: 300px;
  height: 100px;

  border-radius: 5px;

  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  margin: 10px;

  background: linear-gradient(0deg, #be1d20 0%, #d42427 100%);
  color: ${props => props.theme.colors.white};
`;

export const ContactLabel = styled.p`
  font-size: 14px;
`;

export const ContactText = styled.p`
  font-size: 22px;
  font-weight: bold;
`;

export const ContactIcon = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 25px;

  display: flex;
  align-items: center;
  justify-content: center;

  background-color: ${props => props.theme.colors.white};

  > svg {
    font-size: 30px;
    color: ${props => props.theme.colors.primary};
  }
`;

export const ContactDetail = styled.div`
  flex: 1;
  margin-left: 20px;
`;

export const ContactIllustration = styled.img`
  height: 240px;
  width: 280px;

  position: absolute;
  bottom: 18px;
  right: 40px;
`;
