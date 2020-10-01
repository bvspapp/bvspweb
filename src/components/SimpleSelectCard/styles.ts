import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const Container = styled(Link)`
  width: 100%;
  margin: 7px 0;

  background-color: ${props => props.theme.colors.quartenary};
  color: ${props => props.theme.colors.white};

  border-radius: 5px;
  overflow: hidden;

  display: flex;
  align-items: center;
  justify-content: space-between;

  text-decoration: none;

  transition: transform .3s;

  &:hover {
    transform: translateX(10px)
  }
`;

export const Title = styled.span`
  font-size: 16px;
  font-weight: bold;

  margin-left: 10px;
`;

export const Icon = styled.div`
  background-color: ${props => props.theme.colors.primary};

  height: 55px;
  width: 40px;

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 28px;
`;
