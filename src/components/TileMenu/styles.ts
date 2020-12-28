import styled from 'styled-components';

export const Container = styled.a`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;

  font-size: 15px;
  text-align: center;
  text-decoration: none;

  width: 200px;
  height: 170px;

  border-radius: 5px;

  margin: 15px;
  padding: 10px;

  color: ${props => props.theme.colors.black};
  background: ${props => props.theme.colors.secondary};

  cursor: pointer;

  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.theme.colors.primary};
    color: ${props => props.theme.colors.white};
  }

  > svg {
    font-size: 60px;
  }
`;
