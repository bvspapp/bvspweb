import styled from 'styled-components';
import { Link } from 'react-router-dom';

interface ImageContainerProps {
  imageURL: string;
}

export const Container = styled(Link)`
  text-decoration: none;

  margin: 15px;

  width: 230px;
  height: 280px;

  background: linear-gradient(0deg, #be1d20 0%, #d42427 100%);
  border-radius: 10px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;

  padding: 20px 10px;

  transition: transform 0.3s;

  &:hover {
    transform: scale(1.1);
  }
`;

export const Image = styled.div<ImageContainerProps>`
  background: url(${props => props.imageURL}),
    ${props => props.theme.colors.white};
  background-size: contain;
  background-position: center, right bottom;
  background-repeat: no-repeat, no-repeat;

  width: 100px;
  height: 100px;
  border-radius: 50%;
`;

export const TextContainer = styled.div`
  text-align: center;
`;

export const Title = styled.h3`
  color: ${props => props.theme.colors.white};
`;

export const SubTitle = styled.span`
  font-size: 12px;
  text-align: center;
  color: ${props => props.theme.colors.white};

  height: 35px;
  overflow: hidden;
`;

export const Button = styled.button`
  font-size: 20px;

  width: 40px;
  height: 40px;
  border-radius: 20px;

  display: flex;
  align-items: center;
  justify-content: center;

  background-color: #9d1212;
  color: ${props => props.theme.colors.white};
`;
