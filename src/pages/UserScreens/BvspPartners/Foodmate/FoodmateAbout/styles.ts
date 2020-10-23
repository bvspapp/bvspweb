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
  justify-content: space-between;

  margin-top: 15px;
`;

export const Content = styled.main`
  width: 100%;
  margin-top: 45px;
  padding: 20px;
`;

export const LogoImg = styled.img`
  width: 150px;
  height: 60px;
`;

export const ButtonBack = styled.button`
  height: 45px;
  width: 55px;
  border-radius: 5px;
  margin-right: 20px;

  display: flex;
  justify-content: center;
  align-items: center;

  background-color: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.white};

  transition: opacity 0.3s;

  &:hover {
    opacity: 0.8;
  }
`;

export const Title = styled.h3`
  color: ${props => props.theme.colors.primary};

  &:after {
    content: '';
    display: block;
    width: 30px;

    margin-top: 1px;
    border-bottom: 7px solid ${props => props.theme.colors.primary};
  }
`;

export const Description = styled.p`
  margin-top: 20px;
  text-align: justify;
`;

export const LineInfo = styled.div`
  margin-bottom: 30px;
`;

export const HistoryList = styled.div`
  width: 100%;

  display: flex;

  overflow-x: auto;
  margin-bottom: 7px;

  ::-webkit-scrollbar {
    width: 10px;
  }

  ::-webkit-scrollbar-thumb {
    background-color: ${props => props.theme.colors.secondary};

    border-radius: 10px;
  }

  ::-webkit-scrollbar-track {
    background: none;
  }
`;

export const HistoryInfo = styled.span`
  display: block;
  font-size: 14px;
  color: ${props => props.theme.colors.tertiary};
  margin-bottom: 30px;
`;

export const CardContainer = styled.div`
  margin-right: 20px;
`;

export const CardYear = styled.div`
  display: block;
  width: 50px;
  height: 50px;
  border-radius: 25px;

  display: flex;
  align-items: center;
  justify-content: center;

  background-color: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.white};

  margin: 0 auto;
  position: relative;
  bottom: -25px;
`;

export const CardDescription = styled.div`
  width: 330px;

  font-size: 14px;
  text-align: justify;
  padding: 30px 10px 10px;
  border-radius: 5px;

  background-color: ${props => props.theme.colors.fifth};
  color: ${props => props.theme.colors.white};
`;

export const MenuContainer = styled.div``;
