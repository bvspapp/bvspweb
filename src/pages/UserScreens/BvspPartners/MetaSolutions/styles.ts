import styled from 'styled-components';
import { Link } from 'react-router-dom';

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

export const Title = styled.h2`
  color: ${props => props.theme.colors.primary};

  &:after {
    content: '';
    display: block;
    width: 70px;

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

export const PatternsContainer = styled.div`
  width: 100%;
`;

export const PatternsList = styled.div`
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

export const PatternImage = styled.img`
  height: 100px;
  margin: 0 10px;
`;

export const PatternsInfo = styled.span`
  font-size: 14px;
  color: ${props => props.theme.colors.tertiary};
`;

export const ButtonNews = styled(Link)`
  padding: 10px;
  border-radius: 5px;

  margin-top: 50px;

  color: ${props => props.theme.colors.white};
  background-color: ${props => props.theme.colors.primary};
  text-decoration: none;

  width: 200px;
  display: flex;
  align-items: center;
  justify-content: center;

  transition: opacity 0.3s;

  &:hover {
    opacity: 0.8;
  }

  > svg {
    margin-left: 5px;
  }
`;

export const ButtonsContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
`;
