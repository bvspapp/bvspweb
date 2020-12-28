import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  align-items: center;

  background: ${props => props.theme.colors.success};
  color: ${props => props.theme.colors.white};

  border-radius: 5px;
  padding: 12px;
`;

export const RemoveButton = styled.button`
  padding: 5px;

  background: ${props => props.theme.colors.primary};

  border: none;
  border-radius: 50%;

  display: flex;
  align-items: center;
  justify-content: center;

  transition: opacity 0.3s;

  &:hover {
    opacity: 0.7;
  }

  svg {
    color: ${props => props.theme.colors.white};
  }
`;

export const Title = styled.span`
  margin-left: 10px;

  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;
