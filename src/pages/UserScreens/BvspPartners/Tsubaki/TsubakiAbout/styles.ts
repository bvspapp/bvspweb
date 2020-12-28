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

export const OptionsContainer = styled.div`
  width: 100%;

  display: flex;
  justify-content: center;
  flex-wrap: wrap;
`;

export const Option = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: center;

  text-decoration: none;
  color: ${props => props.theme.colors.black};
  font-size: 14px;

  width: 200px;
  height: 150px;
  margin: 10px;

  transition: transform 0.3s;

  background-color: ${props => props.theme.colors.white};
  padding: 10px;
  border-radius: 5px;

  &:hover {
    transform: scale(1.1);
  }
`;

export const OptionImage = styled.img`
  width: 170px;
  height: 70px;
`;

export const OptionLabel = styled.span`
  text-align: center;
`;
