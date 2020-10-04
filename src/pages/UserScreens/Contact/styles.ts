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
  width: 100%;

  display: flex;
  justify-content: space-around;
`;

export const BackButton = styled(Button)`
  font-size: 22px;
  width: 50px;
  height: 40px;
`;

export const ContactContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-top: 30px;

  z-index: 1;
`;

export const ContactBox = styled.div`
  width: 400px;
  height: 100px;
  overflow: hidden;

  border-radius: 5px;

  display: flex;
  align-items: center;

  margin: 10px;

  background: linear-gradient(160deg, #ebebeb 0%, #e0e0e0 100%);
  color: ${props => props.theme.colors.black};
`;

export const ContactLabel = styled.p`
  font-size: 14px;
  margin-left: -50px;
`;

export const ContactText = styled.p`
  font-size: 22px;
  font-weight: bold;
  margin-left: -50px;
`;

export const ContactIcon = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50px;

  display: flex;
  align-items: center;
  justify-content: center;

  position: relative;
  left: -45px;

  background-color: ${props => props.theme.colors.primary};

  > svg {
    font-size: 30px;
    color: ${props => props.theme.colors.white};
    margin-left: 30px;
  }
`;

export const ContactDetail = styled.div`
  flex: 1;
  margin-left: 20px;
`;

export const ContactIllustration = styled.img`
  height: 570px;
  width: 550px;
`;
