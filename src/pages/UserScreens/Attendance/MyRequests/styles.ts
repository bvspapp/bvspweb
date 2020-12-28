import styled from 'styled-components';
import Button from '../../../../components/Form/Button';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;

  flex-wrap: wrap;
  flex: 1;
`;

export const Content = styled.main`
  flex: 1;
  margin-top: 70px;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const Header = styled.header`
  width: 100%;
  display: flex;
  justify-content: space-between;

  margin-top: 15px;
  padding: 0 25px;
`;

export const BackButton = styled(Button)`
  font-size: 22px;
  width: 50px;
  height: 40px;
`;

export const PaginationButtons = styled.div`
  width: 100%;
  margin: 10px;
  padding: 10px;

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
