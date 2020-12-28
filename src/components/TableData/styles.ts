import styled from 'styled-components';
import DataTable from 'react-data-table-component';

export const Container = styled(DataTable)``;

export const ControllerContainer = styled.nav``;

export const Controller = styled.a`
  font-size: 16px;
  margin: 0 7px;

  color: ${props => props.theme.colors.tertiary};

  cursor: pointer;

  transition: all 0.2s ease;

  &:hover {
    color: ${props => props.theme.colors.primary};
  }
`;
