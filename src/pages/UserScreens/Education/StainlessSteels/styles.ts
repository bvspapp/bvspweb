import styled from 'styled-components';
import { Link } from 'react-router-dom';
import Button from '../../../../components/Form/Button';

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
  padding: 0 25px;
`;

export const UserContainer = styled.div``;

export const Content = styled.main`
  width: 100%;
  margin-top: 45px;
  padding: 20px;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const BackButton = styled(Button)`
  font-size: 22px;
  width: 50px;
  height: 40px;
`;

export const ContentRow = styled.div`
  width: 100%;
  margin: 10px 0;

  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const Image = styled.img`
  width: 70px;
  margin-right: 10px;
`;

export const Description = styled.span`
  text-align: justify;
  color: ${props => props.theme.colors.black};
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

export const HistoryContainer = styled.div`
  width: 100%;
  overflow-y: auto;
  display: flex;
  padding-top: 35px;
  padding-bottom: 7px;

  ::-webkit-scrollbar {
    width: 10px;
  }
  ::-webkit-scrollbar-thumb {
    background-color: #c9c9c9;
    border-radius: 10px;
  }
  ::-webkit-scrollbar-track {
    background-color: ${props => props.theme.colors.secondary};
  }
`;

export const HistoryCard = styled.div`
  min-width: 390px;
  max-width: 390px;
  min-height: 270px;
  max-height: 270px;

  padding: 10px;
  border-radius: 5px;

  background-color: ${props => props.theme.colors.quartenary};

  display: flex;
  flex-direction: column;
  align-items: center;

  margin: 0 10px;
`;

export const HistoryYear = styled.span`
  display: block;

  width: 60px;
  height: 60px;
  border-radius: 30px;
  line-height: 60px;
  text-align: center;
  font-weight: bold;

  background-color: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.white};

  position: relative;
  top: -35px;
`;

export const HistoryDescription = styled.p`
  color: ${props => props.theme.colors.white};
  text-align: justify;
`;

export const NextButton = styled(Link)`
  color: ${props => props.theme.colors.black};
  font-size: 18px;

  align-self: flex-end;
  margin-top: 15px;
  font-weight: bold;
  text-decoration: none;

  display: flex;
  align-items: center;

  transition: opacity 0.3s;

  &:hover {
    opacity: 0.8;
  }
`;
