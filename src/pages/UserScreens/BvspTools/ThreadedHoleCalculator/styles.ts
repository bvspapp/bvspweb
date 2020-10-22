import styled from 'styled-components';
import Button from '../../../../components/Form/Button';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;

  flex-wrap: wrap;
  flex: 1;
`;

export const Header = styled.header`
  width: 100%;
  display: flex;
  justify-content: flex-end;

  margin: 15px 0 50px;
  padding: 0 25px;
`;

export const UserContainer = styled.div``;

export const Content = styled.main`
  width: 100%;

  display: flex;
  flex-direction: column;
  justify-content: space-around;

  padding: 20px;
`;

export const BackButton = styled(Button)`
  font-size: 22px;
  width: 50px;
  height: 40px;
`;

export const OptionSelect = styled.select`
  width: 100%;
  font-size: 20px;
  padding: 12px;

  text-align: center;
  border: 1px solid ${props => props.theme.colors.tertiary};
  border-radius: 5px;

  font-size: 20px;
  font-weight: bold;
`;

export const InputRows = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  flex-wrap: wrap;

  margin: 20px 0;
`;

export const InputGroupUnits = styled.div`
  display: flex;
  flex-direction: column;

  width: 23%;
`;

export const InputLabel = styled.span`
  margin-bottom: 3px;
  color: ${props => props.theme.colors.tertiary};
`;
