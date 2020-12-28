import styled from 'styled-components';

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
  justify-content: flex-end;

  margin-top: 15px;

  &:after {
    content: '';
    display: block;
    border-right: 15px solid ${props => props.theme.colors.primary};
  }
`;

export const UserContainer = styled.div``;

export const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;

  margin-right: 7px;
`;

export const User = styled.div`
  display: flex;
  justify-content: flex-end;
`;

export const Welcome = styled.span`
  font-size: 26px;
  font-weight: bold;
  color: ${props => props.theme.colors.black};
`;

export const UserName = styled.span`
  font-size: 26px;
  font-weight: bold;
  color: ${props => props.theme.colors.primary};

  margin-left: 3px;
`;

export const Message = styled.span`
  font-size: 14px;
  color: ${props => props.theme.colors.black};
`;

export const Content = styled.main`
  flex: 1;
  margin-top: 45px;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const MenuContainer = styled.nav`
  width: 100%;

  margin-top: 40px;
`;

export const Row = styled.nav`
  width: 100%;
  display: flex;
  justify-content: center;
  justify-content: center;
  flex-wrap: wrap;
`;
