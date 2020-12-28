import styled from 'styled-components';
import Button from '../../../../components/Form/Button';

export const Container = styled.div``;

export const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;

  margin-bottom: 30px;
`;

export const Content = styled.div``;

export const Title = styled.h2``;

export const ButtonsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;

  > button {
    margin-left: 7px;
  }
`;

export const PaginationButtons = styled.div`
  width: 100%;

  margin-top: 10px;

  display: flex;
  justify-content: flex-end;
  align-items: center;

  button + button {
    margin-left: 10px;
  }
`;

export const PaginationButton = styled(Button)`
  height: 27px;
`;

export const PageNumberLabel = styled.span`
  font-size: 12px;
  font-weight: bold;
  margin: 0 10px;
`;

export const NoRemembers = styled.h3`
  font-size: 14px;
  font-weight: bold;
  text-align: center;
  color: ${props => props.theme.colors.tertiary};
`;
