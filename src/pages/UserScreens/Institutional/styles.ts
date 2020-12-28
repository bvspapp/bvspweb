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

  > iframe {
    width: 95%;
    height: 400px;
    margin-bottom: 20px;

    border: 5px solid ${props => props.theme.colors.secondary};
  }
`;

export const BackButton = styled(Button)`
  font-size: 22px;
  width: 50px;
  height: 40px;
`;

export const Description = styled.p`
  text-align: justify;
  padding: 0 30px;
  margin-top: 20px;
`;
