import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const Container = styled(Link)`
  margin-top: 20px;
  width: 100%;
  display: flex;
  align-items: center;
  border-radius: 5px;
  background-color: ${props => props.theme.colors.white};
  text-decoration: none;

  transition: transform 0.3s;

  &:hover {
    transform: translateX(10px);
  }
`;

export const Icon = styled.div`
  padding: 10px 15px;
  border-radius: 5px;

  background-color: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.white};
`;

export const Title = styled.span`
  color: ${props => props.theme.colors.black};
  text-align: justify;
  margin-left: 10px;
  font-weight: bold;
`;
