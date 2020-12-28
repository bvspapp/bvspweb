import styled from 'styled-components';

export const Container = styled.div``;

export const InputContent = styled.div`
  border: 2px solid ${props => props.theme.colors.secondary};
  border-radius: 5px;

  display: flex;
  align-items: center;

  padding: 3px;

  background-color: ${props => props.theme.colors.white};

  > svg {
    margin-left: 5px;
    color: ${props => props.theme.colors.tertiary};
  }
`;

export const Select = styled.select`
  flex: 1;

  font-size: 15px;

  padding: 7px 0;

  border: none;
  background: none;
`;

export const Option = styled.option``;

export const Label = styled.span`
  font-size: 12px;
  text-transform: uppercase;

  color: ${props => props.theme.colors.tertiary};
`;
