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

  display: flex;
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

export const Detail = styled.div`
  width: 60%;
  margin: 0 30px;
`;

export const ImageContainer = styled.div`
  width: 40%;
  min-height: 400px;

  display: flex;
  align-items: center;

  border: 3px solid ${props => props.theme.colors.secondary};
  border-radius: 5px;

  @media (max-width: 600px) {
    width: 100%;
  }
`;
