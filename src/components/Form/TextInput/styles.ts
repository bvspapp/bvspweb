import styled from 'styled-components';

export const Container = styled.div`
  margin: 7px 0;
`;

export const InputContent = styled.div`
  display: flex;
  align-items: center;

  border: 2px solid ${props => props.theme.colors.secondary};
  border-radius: 5px;

  background-color: ${props => props.theme.colors.white};

  overflow: hidden;

  > svg {
    margin-left: 5px;
    color: ${props => props.theme.colors.tertiary};
  }
`;

export const InputField = styled.input`
  flex: 1;

  border: none;
  padding: 10px 7px;

  background-color: ${props => props.theme.colors.white};
`;

export const Label = styled.span`
  font-size: 12px;
  text-transform: uppercase;
  margin-left: 3px;

  color: ${props => props.theme.colors.tertiary};
`;
