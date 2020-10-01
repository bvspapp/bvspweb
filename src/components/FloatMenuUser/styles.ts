import styled, { keyframes } from 'styled-components';
import { Link } from 'react-router-dom';

const inputAnimation = keyframes`
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
  height: calc(100vh - 40px);
  border-radius: 10px;
  margin-right: 10px;

  display: flex;
  flex-direction: column;

  animation: ${inputAnimation} 0.5s;
`;

export const LogoContainer = styled.div`
  border-radius: 10px;
  background-color: ${props => props.theme.colors.white};

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 20px 0;
`;

export const Logo = styled.img`
  height: 30px;
`;

export const MenuContainer = styled.nav`
  border-radius: 10px;
  background-color: ${props => props.theme.colors.white};

  margin-top: 10px;
  height: calc(100% - 85px);

  display: flex;
  flex-direction: column;
`;

export const Menu = styled(Link)`
  font-size: 16px;

  text-decoration: none;
  color: ${props => props.theme.colors.tertiary};

  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: ${props => props.theme.colors.secondary};

  height: 90px;
  width: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  &:last-child {
    border: none;
  }

  transition: color 0.3s;
  &:hover {
    color: ${props => props.theme.colors.primary};
  }

  > svg {
    font-size: 24px;
  }
`;

export const Logout = styled.button`
  font-size: 16px;

  text-decoration: none;
  color: ${props => props.theme.colors.tertiary};

  background-color: ${props => props.theme.colors.white};
  border-radius: 10px;

  margin-top: 10px;
  height: 90px;
  width: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  transition: color 0.3s;
  &:hover {
    color: ${props => props.theme.colors.primary};
  }

  > svg {
    font-size: 24px;
    margin-bottom: 3px;
  }
`;
