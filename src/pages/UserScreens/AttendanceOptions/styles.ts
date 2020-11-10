import styled from 'styled-components';

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

export const MessageText = styled.p`
  margin-top: 45px;
  font-size: 14px;

  color: ${props => props.theme.colors.tertiary};

  > strong {
    margin-left: 5px;
  }
`;
