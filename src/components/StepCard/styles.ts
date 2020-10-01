import styled from 'styled-components';

export const Container = styled.div`
  margin: 15px 0;

  background: ${props => props.theme.colors.white};
  padding: 15px 10px;
  border-radius: 10px;
  transition: all 0.3s ease;

  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const StepNumber = styled.strong`
  background: ${props => props.theme.colors.success};
  color: #fff;

  font-weight: bold;
  padding: 12px 16px;
  border-radius: 50%;
`;

export const StepTitle = styled.span`
  flex: 1;
  margin-left: 7px;
`;

export const Controllers = styled.div``;

export const ButtonEdit = styled.button`
  display: flex;
  align-items: center;
  font-size: 24px;

  background: none;
  color: ${props => props.theme.colors.success};

  border: none;
  border-radius: 5px;

  cursor: pointer;

  padding: 8px;
  margin: 0 3px;

  transition: opacity 0.3s;

  &:hover {
    opacity: 0.7;
  }
`;

export const ButtonRemove = styled.button`
  display: flex;
  align-items: center;
  font-size: 24px;

  background: none;
  color: ${props => props.theme.colors.warning};

  border: none;
  border-radius: 5px;

  cursor: pointer;

  padding: 8px;
  margin: 0 3px;

  transition: opacity 0.3s;

  &:hover {
    opacity: 0.7;
  }
`;
