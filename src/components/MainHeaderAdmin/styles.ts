import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const Container = styled.header`
  grid-area: MH;

  display: flex;
  flex: 1;
  align-items: center;
  justify-content: space-between;

  background-color: ${props => props.theme.colors.secondary};

  padding: 0 20px;
`;

export const LogoImg = styled.img`
  height: 35px;

  @media (max-width: 400px) {
    height: 35px;
  }
`;

export const NavMenu = styled.nav`
  display: flex;
  align-items: center;
`;

export const NavMenuItemLink = styled(Link)`
  color: ${props => props.theme.colors.tertiary};

  transition: color 0.3s;

  &:hover {
    color: ${props => props.theme.colors.primary};
  }

  > svg {
    font-size: 24px;
  }
`;

export const NavNotificationMenuItemButton = styled.div`
  color: ${props => props.theme.colors.tertiary};
  position: relative;
  transition: color 0.3s;

  &:hover {
    color: ${props => props.theme.colors.primary};
  }

  > svg {
    font-size: 24px;
  }

  > span {
    font-size: 12px;
    display: block;
    position: absolute;
    top: -7px;
    right: -7px;
    text-align: center;
    line-height: 20px;

    width: 20px;
    height: 20px;
    border-radius: 10px;
    color: ${props => props.theme.colors.white};
    background-color: ${props => props.theme.colors.primary};
  }
`;

export const NavMenuItemButton = styled.button`
  border: none;
  background: none;
  color: ${props => props.theme.colors.tertiary};

  transition: color 0.3s;

  &:hover {
    color: ${props => props.theme.colors.primary};
  }

  > svg {
    font-size: 24px;
  }
`;

export const Divider = styled.span`
  display: inline-block;

  width: 1px;
  height: 20px;

  margin: 0 20px;

  background: ${props => props.theme.colors.tertiary};
  opacity: 0.5;
`;

export const User = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

export const UserName = styled.span`
  font-weight: bold;
  color: ${props => props.theme.colors.black};
`;
