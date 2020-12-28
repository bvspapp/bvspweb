import styled from 'styled-components';
import Switch, { ReactSwitchProps } from 'react-switch';

export const Container = styled.div`
  display: flex;
  align-items: center;
`;

export const ToggleLabel = styled.span`
  color: ${props => props.theme.colors.black};
  font-size: 14px;
  font-weight: bold;
`;

export const ToggleSelector = styled(Switch)<ReactSwitchProps>`
  margin: 0 7px;
`;
