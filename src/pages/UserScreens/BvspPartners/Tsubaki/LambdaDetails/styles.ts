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

export const ItemsContainer = styled.div`
  margin-top: 20px;
`;

export const Item = styled.div`
  background-color: ${props => props.theme.colors.white};
  color: ${props => props.theme.colors.black};
  text-align: justify;

  padding: 10px;
  margin: 10px 0;

  border-left-style: solid;
  border-left-color: ${props => props.theme.colors.primary};
  border-left-width: 10px;

  border-radius: 5px;
`;

export const TitleSecondary = styled.p`
  font-weight: bold;
  margin-bottom: -10px;
`;
