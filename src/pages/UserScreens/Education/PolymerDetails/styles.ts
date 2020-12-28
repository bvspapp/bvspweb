import styled from 'styled-components';
import Button from '../../../../components/Form/Button';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;

  flex-wrap: wrap;
  flex: 1;
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
  margin-top: 7px;
  padding: 20px 0;

  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
`;

export const BackButton = styled(Button)`
  font-size: 22px;
  width: 50px;
  height: 40px;
`;

export const CardTitle = styled.div`
  background-color: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.white};

  font-size: 18px;
  padding: 10px 20px;
  border-bottom-right-radius: 5px;
  border-top-right-radius: 5px;
`;

export const CardsContainer = styled.div`
  width: 100%;
  padding: 20px;
`;

export const CardDescription = styled.div`
  background-color: ${props => props.theme.colors.quartenary};
  color: ${props => props.theme.colors.white};
  padding: 10px;
  border-radius: 5px;
  margin: 5px 0;
`;
