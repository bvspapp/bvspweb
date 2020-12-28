import styled from 'styled-components';

interface IProps {
  active: boolean;
}

export const Container = styled.div<IProps>`
  width: 150px;
  height: 110px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  cursor: pointer;
  transition: opacity 0.3s;

  background-color: ${props =>
    props.active ? props.theme.colors.primary : props.theme.colors.secondary};
  color: ${props =>
    props.active ? props.theme.colors.white : props.theme.colors.black};
  border-radius: 5px;

  &:hover {
    opacity: 0.7;
  }

  > span {
    font-size: 14px;
    font-weight: bold;

    margin-top: 15px;
  }

  > svg {
    font-size: 34px;
  }
`;
