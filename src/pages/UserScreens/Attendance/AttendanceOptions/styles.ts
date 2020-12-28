import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;

  flex-wrap: wrap;
  flex: 1;
`;

export const Content = styled.main`
  flex: 1;
  margin-top: 70px;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const MenuContainer = styled.nav`
  margin-top: 40px;

  display: flex;
  justify-content: center;
  flex-wrap: wrap;
`;

export const MyRequestsButton = styled(Link)`
  background-color: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.white};
  text-decoration: none;

  display: flex;
  align-items: center;
  justify-content: center;

  margin-top: 50px;

  padding: 10px;
  border-radius: 5px;

  transition: opacity 0.3s;

  &:hover {
    opacity: 0.7;
  }

  > svg {
    font-size: 18px;
    margin-right: 3px;
  }
`;
