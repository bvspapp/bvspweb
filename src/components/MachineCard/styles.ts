import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  background: ${props => props.theme.colors.secondary};

  margin: 10px;
  padding: 10px;

  border-radius: 5px;
`;

export const Title = styled.span`
  font-size: 14px;
`;

export const RemoveButton = styled.button`
  background: none;
  color: ${props => props.theme.colors.warning};

  margin-top: 7px;
  font-size: 13px;

  transition: opacity 0.3s;

  &:hover {
    opacity: 0.7;
  }
`;
