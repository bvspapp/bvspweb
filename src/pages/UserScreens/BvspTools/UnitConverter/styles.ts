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

export const InverterButton = styled.button`
  background-color: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.white};

  font-weight: bold;
  border-radius: 5px;

  width: 23%;
  height: 55px;

  display: flex;
  justify-content: center;
  align-items: center;

  font-size: 20px;

  svg {
    font-size: 24px;
    margin-right: 5px;
  }
`;

export const CalcButton = styled.button`
  background-color: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.white};

  border-radius: 5px;
  font-weight: bold;

  width: 170px;
  height: 63px;

  display: flex;
  justify-content: center;
  align-items: center;

  font-size: 20px;

  svg {
    font-size: 24px;
    margin-right: 5px;
  }
`;

export const InputGroupUnits = styled.div`
  display: flex;
  flex-direction: column;

  width: 23%;
`;

export const InputGroupCalc = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

export const InputLabel = styled.span`
  margin-bottom: 3px;
  color: ${props => props.theme.colors.tertiary};
`;

export const InputConverter = styled.input`
  flex: 1;
  font-size: 36px;
  padding: 7px;
  border-radius: 5px;
  text-align: center;

  border: 1px solid ${props => props.theme.colors.tertiary};
  margin-right: 30px;
  flex: 1;
`;

export const ResultContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 50px;
`;

export const ResultLabel = styled.span`
  font-weight: bold;
`;

export const ResultValue = styled.h2`
  font-size: 64px;
`;
